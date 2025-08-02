import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.9";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Store active connections
const connections = new Map<string, WebSocket>();

const handler = async (req: Request): Promise<Response> => {
  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  console.log('New WebSocket connection requested');

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  // Generate unique connection ID
  const connectionId = crypto.randomUUID();
  
  socket.onopen = () => {
    console.log(`WebSocket connection opened: ${connectionId}`);
    connections.set(connectionId, socket);
    
    // Send welcome message
    socket.send(JSON.stringify({
      type: 'connection_established',
      connection_id: connectionId,
      timestamp: new Date().toISOString(),
      message: 'Real-time threat intelligence stream connected'
    }));
  };

  socket.onmessage = async (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log(`Received message from ${connectionId}:`, message.type);

      switch (message.type) {
        case 'subscribe_threats':
          await handleThreatSubscription(socket, message);
          break;
          
        case 'subscribe_alerts':
          await handleAlertSubscription(socket, message);
          break;
          
        case 'get_latest_threats':
          await sendLatestThreats(socket, message.limit || 10);
          break;
          
        case 'trigger_analysis':
          await triggerAIAnalysis(socket, message);
          break;
          
        case 'heartbeat':
          socket.send(JSON.stringify({
            type: 'heartbeat_response',
            timestamp: new Date().toISOString()
          }));
          break;
          
        default:
          console.log(`Unknown message type: ${message.type}`);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process message',
        error: error.message
      }));
    }
  };

  socket.onclose = () => {
    console.log(`WebSocket connection closed: ${connectionId}`);
    connections.delete(connectionId);
  };

  socket.onerror = (error) => {
    console.error(`WebSocket error for ${connectionId}:`, error);
    connections.delete(connectionId);
  };

  return response;
};

async function handleThreatSubscription(socket: WebSocket, message: any) {
  try {
    console.log('Setting up threat subscription');
    
    // Send confirmation
    socket.send(JSON.stringify({
      type: 'subscription_confirmed',
      subscription: 'threats',
      filters: message.filters || {},
      timestamp: new Date().toISOString()
    }));

    // Send initial batch of recent threats
    await sendLatestThreats(socket, 20);
    
  } catch (error) {
    console.error('Error setting up threat subscription:', error);
    socket.send(JSON.stringify({
      type: 'subscription_error',
      error: error.message
    }));
  }
}

async function handleAlertSubscription(socket: WebSocket, message: any) {
  try {
    console.log('Setting up alert subscription');
    
    const userId = message.user_id;
    if (!userId) {
      throw new Error('User ID required for alert subscription');
    }

    // Send confirmation
    socket.send(JSON.stringify({
      type: 'subscription_confirmed',
      subscription: 'alerts',
      user_id: userId,
      timestamp: new Date().toISOString()
    }));

    // Send recent alerts
    const { data: alerts } = await supabase
      .from('user_alerts')
      .select(`
        *,
        threat_signals(*)
      `)
      .eq('user_id', userId)
      .order('triggered_at', { ascending: false })
      .limit(10);

    socket.send(JSON.stringify({
      type: 'recent_alerts',
      alerts: alerts || [],
      timestamp: new Date().toISOString()
    }));

  } catch (error) {
    console.error('Error setting up alert subscription:', error);
    socket.send(JSON.stringify({
      type: 'subscription_error',
      error: error.message
    }));
  }
}

async function sendLatestThreats(socket: WebSocket, limit: number = 10) {
  try {
    const { data: threats, error } = await supabase
      .from('threat_signals')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    socket.send(JSON.stringify({
      type: 'threat_update',
      threats: threats || [],
      count: threats?.length || 0,
      timestamp: new Date().toISOString()
    }));

  } catch (error) {
    console.error('Error fetching latest threats:', error);
    socket.send(JSON.stringify({
      type: 'error',
      message: 'Failed to fetch threats',
      error: error.message
    }));
  }
}

async function triggerAIAnalysis(socket: WebSocket, message: any) {
  try {
    console.log('Triggering AI analysis for real-time processing');
    
    // Send status update
    socket.send(JSON.stringify({
      type: 'analysis_started',
      timestamp: new Date().toISOString()
    }));

    // Get recent unanalyzed threats
    const { data: threats } = await supabase
      .from('threat_signals')
      .select('*')
      .is('ai_analysis', null)
      .order('created_at', { ascending: false })
      .limit(5);

    if (!threats || threats.length === 0) {
      socket.send(JSON.stringify({
        type: 'analysis_complete',
        message: 'No threats require analysis',
        timestamp: new Date().toISOString()
      }));
      return;
    }

    // Call AI analysis function
    const response = await supabase.functions.invoke('ai-threat-analysis', {
      body: {
        threats: threats.map(t => ({
          title: t.title,
          summary: t.summary,
          source_name: t.source_name,
          existing_category: t.category,
          existing_severity: t.severity
        }))
      }
    });

    socket.send(JSON.stringify({
      type: 'analysis_complete',
      analyzed_count: threats.length,
      results: response.data,
      timestamp: new Date().toISOString()
    }));

  } catch (error) {
    console.error('Error triggering AI analysis:', error);
    socket.send(JSON.stringify({
      type: 'analysis_error',
      error: error.message,
      timestamp: new Date().toISOString()
    }));
  }
}

// Broadcast function for sending updates to all connected clients
export async function broadcastToAll(message: any) {
  const messageStr = JSON.stringify({
    ...message,
    timestamp: new Date().toISOString()
  });

  console.log(`Broadcasting to ${connections.size} connections:`, message.type);

  for (const [connectionId, socket] of connections) {
    try {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(messageStr);
      } else {
        // Clean up closed connections
        connections.delete(connectionId);
      }
    } catch (error) {
      console.error(`Error broadcasting to ${connectionId}:`, error);
      connections.delete(connectionId);
    }
  }
}

// Function to broadcast new threats
export async function broadcastNewThreat(threat: any) {
  await broadcastToAll({
    type: 'new_threat',
    threat,
    source: 'real_time_ingestion'
  });
}

// Function to broadcast new alerts
export async function broadcastNewAlert(alert: any, userId: string) {
  await broadcastToAll({
    type: 'new_alert',
    alert,
    user_id: userId,
    source: 'alert_system'
  });
}

serve(handler);