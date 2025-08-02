import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.9";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ClientConnection {
  socket: WebSocket;
  id: string;
  user_id?: string;
  email?: string;
  name?: string;
  subscriptions: Set<string>;
  last_heartbeat: number;
  status: 'online' | 'analyzing' | 'monitoring';
  current_view?: string;
}

// Global connection management
const connections = new Map<string, ClientConnection>();
const userPresence = new Map<string, any>();
const streamStats = {
  total_connections: 0,
  active_users: 0,
  threats_processed: 0,
  alerts_sent: 0,
  analysis_queue: 0
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  const connectionId = crypto.randomUUID();
  
  console.log(`New WebSocket connection: ${connectionId}`);

  socket.onopen = () => {
    const connection: ClientConnection = {
      socket,
      id: connectionId,
      subscriptions: new Set(),
      last_heartbeat: Date.now(),
      status: 'online'
    };
    
    connections.set(connectionId, connection);
    streamStats.total_connections++;
    
    console.log(`Connection ${connectionId} established. Total connections: ${connections.size}`);
    
    // Send connection confirmation
    socket.send(JSON.stringify({
      type: 'connection_established',
      connection_id: connectionId,
      timestamp: new Date().toISOString(),
      stats: streamStats
    }));

    // Broadcast updated presence to all clients
    broadcastPresenceUpdate();
  };

  socket.onmessage = async (event) => {
    try {
      const data = JSON.parse(event.data);
      const connection = connections.get(connectionId);
      
      if (!connection) return;

      console.log(`Received message from ${connectionId}: ${data.type}`);
      connection.last_heartbeat = Date.now();

      await handleMessage(connection, data);
      
    } catch (error) {
      console.error(`Error handling message from ${connectionId}:`, error);
    }
  };

  socket.onclose = () => {
    console.log(`Connection ${connectionId} closed`);
    const connection = connections.get(connectionId);
    
    if (connection?.user_id) {
      userPresence.delete(connection.user_id);
      streamStats.active_users--;
    }
    
    connections.delete(connectionId);
    broadcastPresenceUpdate();
  };

  socket.onerror = (error) => {
    console.error(`WebSocket error for ${connectionId}:`, error);
  };

  return response;
};

async function handleMessage(connection: ClientConnection, data: any) {
  const { type } = data;

  switch (type) {
    case 'authenticate':
      await handleAuthentication(connection, data);
      break;

    case 'subscribe_threats':
      connection.subscriptions.add('threats');
      console.log(`${connection.id} subscribed to threats`);
      
      // Send recent threats
      await sendRecentThreats(connection, data.filters);
      break;

    case 'subscribe_alerts':
      connection.subscriptions.add('user_alerts');
      connection.user_id = data.user_id;
      console.log(`${connection.id} subscribed to user alerts for ${data.user_id}`);
      break;

    case 'subscribe_presence':
      connection.subscriptions.add('presence');
      console.log(`${connection.id} subscribed to presence updates`);
      
      // Send current presence state
      connection.socket.send(JSON.stringify({
        type: 'presence_state',
        users: Array.from(userPresence.values()),
        timestamp: new Date().toISOString()
      }));
      break;

    case 'update_presence':
      if (connection.user_id) {
        await updateUserPresence(connection, data);
      }
      break;

    case 'trigger_analysis':
      console.log(`Analysis triggered by ${connection.id}`);
      await triggerAIAnalysis(connection);
      break;

    case 'broadcast_analysis_result':
      await broadcastAnalysisResults(data.results);
      break;

    case 'heartbeat':
      connection.socket.send(JSON.stringify({
        type: 'heartbeat_response',
        timestamp: new Date().toISOString()
      }));
      break;

    case 'stream_stats':
      connection.socket.send(JSON.stringify({
        type: 'stream_stats',
        stats: {
          ...streamStats,
          connected_users: connections.size,
          active_subscriptions: Array.from(connection.subscriptions)
        },
        timestamp: new Date().toISOString()
      }));
      break;

    default:
      console.log(`Unhandled message type: ${type}`);
  }
}

async function handleAuthentication(connection: ClientConnection, data: any) {
  try {
    const { user_id, email, name } = data;
    
    connection.user_id = user_id;
    connection.email = email;
    connection.name = name;
    
    // Update user presence
    const presence = {
      user_id,
      email,
      name,
      status: 'online',
      online_at: new Date().toISOString(),
      connection_id: connection.id
    };
    
    userPresence.set(user_id, presence);
    streamStats.active_users++;
    
    console.log(`User authenticated: ${email} (${user_id})`);
    
    connection.socket.send(JSON.stringify({
      type: 'authentication_success',
      user: presence,
      timestamp: new Date().toISOString()
    }));
    
    broadcastPresenceUpdate();
    
  } catch (error) {
    console.error('Authentication error:', error);
    connection.socket.send(JSON.stringify({
      type: 'authentication_error',
      error: error.message,
      timestamp: new Date().toISOString()
    }));
  }
}

async function updateUserPresence(connection: ClientConnection, data: any) {
  const { status, current_view } = data;
  
  if (connection.user_id && userPresence.has(connection.user_id)) {
    const presence = userPresence.get(connection.user_id);
    presence.status = status || presence.status;
    presence.current_view = current_view || presence.current_view;
    presence.last_seen = new Date().toISOString();
    
    userPresence.set(connection.user_id, presence);
    
    // Broadcast presence update
    broadcastToSubscribers('presence', {
      type: 'presence_update',
      user: presence,
      timestamp: new Date().toISOString()
    });
  }
}

async function sendRecentThreats(connection: ClientConnection, filters: any = {}) {
  try {
    let query = supabase
      .from('threat_signals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    // Apply filters
    if (filters.severity && filters.severity.length > 0) {
      query = query.in('severity', filters.severity);
    }
    
    if (filters.categories && filters.categories.length > 0) {
      query = query.in('category', filters.categories);
    }

    const { data: threats, error } = await query;
    
    if (error) throw error;

    connection.socket.send(JSON.stringify({
      type: 'threat_update',
      threats: threats || [],
      timestamp: new Date().toISOString()
    }));
    
  } catch (error) {
    console.error('Error fetching recent threats:', error);
  }
}

async function triggerAIAnalysis(connection: ClientConnection) {
  try {
    streamStats.analysis_queue++;
    
    // Broadcast analysis started
    broadcastToSubscribers('threats', {
      type: 'analysis_started',
      triggered_by: connection.user_id,
      timestamp: new Date().toISOString()
    });

    // Call AI analysis function
    const { data, error } = await supabase.functions.invoke('ai-threat-analysis', {
      body: {
        user_id: connection.user_id,
        source: 'realtime_trigger'
      }
    });

    if (error) throw error;

    streamStats.analysis_queue--;
    streamStats.threats_processed += data?.processed_count || 0;

    // Broadcast analysis complete
    broadcastToSubscribers('threats', {
      type: 'analysis_complete',
      results: data,
      triggered_by: connection.user_id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Analysis error:', error);
    streamStats.analysis_queue--;
    
    broadcastToSubscribers('threats', {
      type: 'analysis_error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

async function broadcastAnalysisResults(results: any) {
  streamStats.alerts_sent++;
  
  broadcastToSubscribers('threats', {
    type: 'analysis_results',
    results,
    timestamp: new Date().toISOString()
  });
}

function broadcastToSubscribers(subscription: string, message: any) {
  for (const connection of connections.values()) {
    if (connection.subscriptions.has(subscription) && connection.socket.readyState === WebSocket.OPEN) {
      try {
        connection.socket.send(JSON.stringify(message));
      } catch (error) {
        console.error(`Error broadcasting to ${connection.id}:`, error);
      }
    }
  }
}

function broadcastPresenceUpdate() {
  const message = {
    type: 'presence_sync',
    users: Array.from(userPresence.values()),
    stats: {
      total_connections: connections.size,
      active_users: streamStats.active_users
    },
    timestamp: new Date().toISOString()
  };

  broadcastToSubscribers('presence', message);
}

// Cleanup inactive connections
setInterval(() => {
  const now = Date.now();
  const timeout = 60 * 1000; // 1 minute timeout
  
  for (const [id, connection] of connections.entries()) {
    if (now - connection.last_heartbeat > timeout) {
      console.log(`Cleaning up inactive connection: ${id}`);
      connection.socket.close();
      connections.delete(id);
      
      if (connection.user_id) {
        userPresence.delete(connection.user_id);
        streamStats.active_users--;
      }
    }
  }
}, 30 * 1000); // Check every 30 seconds

// Periodic stats broadcast
setInterval(() => {
  broadcastToSubscribers('threats', {
    type: 'stream_stats_update',
    stats: {
      ...streamStats,
      connected_users: connections.size,
      timestamp: new Date().toISOString()
    }
  });
}, 10 * 1000); // Every 10 seconds

serve(handler);