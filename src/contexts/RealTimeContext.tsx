import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface RealTimeContextType {
  isConnected: boolean;
  connectionId?: string;
  onlineUsers: UserPresence[];
  realtimeThreats: any[];
  streamStats: StreamStats;
  lastUpdate?: string;
  analysisStatus: 'idle' | 'analyzing' | 'complete' | 'error';
  subscribe: (channel: string, callback: (data: any) => void) => void;
  unsubscribe: (channel: string) => void;
  updatePresence: (status: UserPresence['status'], currentView?: string) => void;
  triggerAIAnalysis: () => void;
  broadcastToChannel: (channel: string, data: any) => void;
}

interface UserPresence {
  user_id: string;
  email: string;
  name?: string;
  online_at: string;
  status: 'online' | 'analyzing' | 'monitoring';
  current_view?: string;
}

interface StreamStats {
  connected_users: number;
  active_users: number;
  threats_processed: number;
  alerts_sent: number;
  analysis_queue: number;
}

const RealTimeContext = createContext<RealTimeContextType | null>(null);

interface RealTimeProviderProps {
  children: ReactNode;
}

export const RealTimeProvider = ({ children }: RealTimeProviderProps) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionId, setConnectionId] = useState<string>();
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
  const [realtimeThreats, setRealtimeThreats] = useState<any[]>([]);
  const [streamStats, setStreamStats] = useState<StreamStats>({
    connected_users: 0,
    active_users: 0,
    threats_processed: 0,
    alerts_sent: 0,
    analysis_queue: 0
  });
  const [lastUpdate, setLastUpdate] = useState<string>();
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'analyzing' | 'complete' | 'error'>('idle');
  
  const wsRef = useRef<WebSocket | null>(null);
  const subscriptionsRef = useRef<Map<string, (data: any) => void>>(new Map());
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  useEffect(() => {
    if (user) {
      connect();
    }
    
    return () => {
      disconnect();
    };
  }, [user]);

  const connect = () => {
    if (isConnected || !user) return;

    try {
      console.log('🔗 Connecting to global real-time system...');
      
      const wsUrl = `wss://eydehwbjzpanyzzshgyd.functions.supabase.co/enhanced-realtime-stream`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('✅ Global real-time connection established');
        setIsConnected(true);
        setReconnectAttempts(0);

        // Authenticate
        wsRef.current?.send(JSON.stringify({
          type: 'authenticate',
          user_id: user.id,
          email: user.email,
          name: (user as any).user_metadata?.name || user.email
        }));

        // Subscribe to core channels
        subscribeToCore();
        startHeartbeat();
        
        toast.success('🌐 Connected to real-time intelligence network');
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleGlobalMessage(data);
        } catch (error) {
          console.error('Error parsing global message:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('❌ Global real-time connection closed');
        setIsConnected(false);
        setOnlineUsers([]);

        // Auto-reconnect
        if (event.code !== 1000 && reconnectAttempts < 5) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connect();
          }, delay);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('Global WebSocket error:', error);
      };

    } catch (error) {
      console.error('Error connecting to global real-time:', error);
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'User disconnected');
      wsRef.current = null;
    }
    
    setIsConnected(false);
    setOnlineUsers([]);
    subscriptionsRef.current.clear();
  };

  const subscribeToCore = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      // Core subscriptions
      wsRef.current.send(JSON.stringify({ type: 'subscribe_threats' }));
      wsRef.current.send(JSON.stringify({ type: 'subscribe_presence' }));
      wsRef.current.send(JSON.stringify({ type: 'subscribe_alerts', user_id: user?.id }));
    }
  };

  const startHeartbeat = () => {
    const interval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'heartbeat',
          timestamp: new Date().toISOString()
        }));
      } else {
        clearInterval(interval);
      }
    }, 30000);
  };

  const handleGlobalMessage = (data: any) => {
    setLastUpdate(data.timestamp);

    // Broadcast to specific channel subscribers
    subscriptionsRef.current.forEach((callback, channel) => {
      if (shouldBroadcastToChannel(channel, data.type)) {
        callback(data);
      }
    });

    // Handle global state updates
    switch (data.type) {
      case 'connection_established':
        setConnectionId(data.connection_id);
        if (data.stats) setStreamStats(data.stats);
        break;

      case 'threat_update':
      case 'new_threat':
        if (data.threats) {
          setRealtimeThreats(data.threats.slice(0, 20));
        } else if (data.threat) {
          setRealtimeThreats(prev => [data.threat, ...prev.slice(0, 19)]);
          
          // Global threat notifications
          if (['high', 'critical'].includes(data.threat.severity)) {
            toast.warning(`🚨 ${data.threat.severity.toUpperCase()}: ${data.threat.title.substring(0, 60)}...`, {
              duration: 5000
            });
          }
        }
        break;

      case 'presence_sync':
      case 'presence_update':
        if (data.users) setOnlineUsers(data.users);
        if (data.stats) setStreamStats(prev => ({ ...prev, ...data.stats }));
        break;

      case 'analysis_started':
        setAnalysisStatus('analyzing');
        toast.info('🤖 AI analysis in progress...');
        break;

      case 'analysis_complete':
        setAnalysisStatus('complete');
        setTimeout(() => setAnalysisStatus('idle'), 3000);
        toast.success('✅ AI analysis completed');
        break;

      case 'analysis_error':
        setAnalysisStatus('error');
        setTimeout(() => setAnalysisStatus('idle'), 5000);
        break;

      case 'stream_stats_update':
        if (data.stats) setStreamStats(data.stats);
        break;
    }
  };

  const shouldBroadcastToChannel = (channel: string, messageType: string): boolean => {
    const channelMappings: Record<string, string[]> = {
      'threats': ['threat_update', 'new_threat', 'analysis_complete', 'analysis_results'],
      'presence': ['presence_sync', 'presence_update'],
      'alerts': ['alert_triggered', 'user_alert'],
      'watchlist': ['watchlist_update', 'watchlist_item_added'],
      'resilience': ['dss_update', 'recommendation_update'],
      'executive': ['executive_briefing_update', 'metrics_update'],
      'analytics': ['analytics_update', 'performance_metrics']
    };

    return channelMappings[channel]?.includes(messageType) || false;
  };

  const subscribe = (channel: string, callback: (data: any) => void) => {
    subscriptionsRef.current.set(channel, callback);
    console.log(`📡 Subscribed to real-time channel: ${channel}`);
  };

  const unsubscribe = (channel: string) => {
    subscriptionsRef.current.delete(channel);
    console.log(`📡 Unsubscribed from channel: ${channel}`);
  };

  const updatePresence = (status: UserPresence['status'], currentView?: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN && user) {
      wsRef.current.send(JSON.stringify({
        type: 'update_presence',
        status,
        current_view: currentView
      }));
    }
  };

  const triggerAIAnalysis = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'trigger_analysis'
      }));
      setAnalysisStatus('analyzing');
    }
  };

  const broadcastToChannel = (channel: string, data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'broadcast_to_channel',
        channel,
        data
      }));
    }
  };

  const contextValue: RealTimeContextType = {
    isConnected,
    connectionId,
    onlineUsers,
    realtimeThreats,
    streamStats,
    lastUpdate,
    analysisStatus,
    subscribe,
    unsubscribe,
    updatePresence,
    triggerAIAnalysis,
    broadcastToChannel
  };

  return (
    <RealTimeContext.Provider value={contextValue}>
      {children}
    </RealTimeContext.Provider>
  );
};

export const useRealTime = () => {
  const context = useContext(RealTimeContext);
  if (!context) {
    throw new Error('useRealTime must be used within a RealTimeProvider');
  }
  return context;
};

// Real-time status indicator component
export const RealTimeStatus = () => {
  const { isConnected, onlineUsers, streamStats } = useRealTime();
  
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
      <span className="text-muted-foreground">
        {isConnected ? `Live • ${onlineUsers.length} online` : 'Offline'}
      </span>
      {isConnected && streamStats.analysis_queue > 0 && (
        <span className="text-blue-500">• {streamStats.analysis_queue} analyzing</span>
      )}
    </div>
  );
};