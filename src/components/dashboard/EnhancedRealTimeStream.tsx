import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Wifi, 
  WifiOff, 
  Activity, 
  Users, 
  AlertTriangle, 
  Zap,
  Clock,
  Eye,
  TrendingUp,
  Globe,
  Radio,
  Brain,
  Settings
} from 'lucide-react';

interface ThreatUpdate {
  id: string;
  type: 'new_threat' | 'threat_update' | 'analysis_complete' | 'alert_triggered' | 'analysis_results';
  data?: any;
  threats?: any[];
  results?: any;
  timestamp: string;
  source?: string;
  triggered_by?: string;
}

interface UserPresence {
  user_id: string;
  email: string;
  name?: string;
  online_at: string;
  status: 'online' | 'analyzing' | 'monitoring';
  current_view?: string;
  connection_id?: string;
}

interface StreamStats {
  connected_users: number;
  active_users: number;
  threats_processed: number;
  alerts_sent: number;
  analysis_queue: number;
  total_connections: number;
}

interface ConnectionState {
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  connectionId?: string;
  lastHeartbeat?: string;
  reconnectAttempts: number;
}

export const EnhancedRealTimeStream = () => {
  const { user } = useAuth();
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    status: 'disconnected',
    reconnectAttempts: 0
  });
  const [realtimeThreats, setRealtimeThreats] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
  const [streamStats, setStreamStats] = useState<StreamStats>({
    connected_users: 0,
    active_users: 0,
    threats_processed: 0,
    alerts_sent: 0,
    analysis_queue: 0,
    total_connections: 0
  });
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'analyzing' | 'complete' | 'error'>('idle');
  const [subscriptions, setSubscriptions] = useState<Set<string>>(new Set());

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (user) {
      connect();
    }
    
    return () => {
      disconnect();
    };
  }, [user]);

  const connect = () => {
    if (connectionState.status === 'connecting' || connectionState.status === 'connected') {
      return;
    }

    setConnectionState(prev => ({ ...prev, status: 'connecting' }));

    try {
      console.log('Connecting to enhanced real-time stream...');
      
      const wsUrl = `wss://eydehwbjzpanyzzshgyd.functions.supabase.co/enhanced-realtime-stream`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('Enhanced WebSocket connected');
        setConnectionState(prev => ({ 
          ...prev, 
          status: 'connected',
          reconnectAttempts: 0 
        }));

        // Authenticate user
        if (user) {
          wsRef.current?.send(JSON.stringify({
            type: 'authenticate',
            user_id: user.id,
            email: user.email,
            name: (user as any).user_metadata?.name || user.email
          }));
        }

        // Subscribe to different data streams
        subscribeToStreams();
        startHeartbeat();
        
        toast.success('Connected to enhanced real-time intelligence');
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received enhanced message:', data.type);
          handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('Enhanced WebSocket closed:', event.code, event.reason);
        setConnectionState(prev => ({ ...prev, status: 'disconnected' }));
        setOnlineUsers([]);

        // Auto-reconnect with exponential backoff
        if (event.code !== 1000 && connectionState.reconnectAttempts < 5) {
          const delay = Math.min(1000 * Math.pow(2, connectionState.reconnectAttempts), 30000);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            setConnectionState(prev => ({ 
              ...prev, 
              reconnectAttempts: prev.reconnectAttempts + 1 
            }));
            connect();
          }, delay);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('Enhanced WebSocket error:', error);
        setConnectionState(prev => ({ ...prev, status: 'error' }));
        toast.error('Real-time connection error');
      };

    } catch (error) {
      console.error('Error connecting to enhanced WebSocket:', error);
      setConnectionState(prev => ({ ...prev, status: 'error' }));
      toast.error('Failed to connect to enhanced stream');
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
    
    setConnectionState({ status: 'disconnected', reconnectAttempts: 0 });
    setOnlineUsers([]);
  };

  const subscribeToStreams = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      // Subscribe to threats
      wsRef.current.send(JSON.stringify({
        type: 'subscribe_threats',
        filters: {
          severity: ['high', 'critical'],
          categories: ['Cyber', 'Military', 'Economic']
        }
      }));
      setSubscriptions(prev => new Set([...prev, 'threats']));

      // Subscribe to user presence
      wsRef.current.send(JSON.stringify({
        type: 'subscribe_presence'
      }));
      setSubscriptions(prev => new Set([...prev, 'presence']));

      // Subscribe to alerts if user is authenticated
      if (user) {
        wsRef.current.send(JSON.stringify({
          type: 'subscribe_alerts',
          user_id: user.id
        }));
        setSubscriptions(prev => new Set([...prev, 'alerts']));
      }
    }
  };

  const startHeartbeat = () => {
    const heartbeatInterval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'heartbeat',
          timestamp: new Date().toISOString()
        }));
      } else {
        clearInterval(heartbeatInterval);
      }
    }, 30000);
  };

  const handleMessage = (data: any) => {
    setLastUpdate(data.timestamp);

    switch (data.type) {
      case 'connection_established':
        setConnectionState(prev => ({
          ...prev,
          connectionId: data.connection_id
        }));
        if (data.stats) {
          setStreamStats(data.stats);
        }
        break;

      case 'authentication_success':
        console.log('Authentication successful');
        break;

      case 'threat_update':
        if (data.threats) {
          setRealtimeThreats(data.threats.slice(0, 15));
        }
        break;

      case 'new_threat':
        if (data.threat) {
          setRealtimeThreats(prev => [data.threat, ...prev.slice(0, 14)]);
          
          if (['high', 'critical'].includes(data.threat.severity)) {
            toast.warning(`🚨 ${data.threat.severity.toUpperCase()}: ${data.threat.title.substring(0, 60)}...`);
          }
        }
        break;

      case 'presence_sync':
      case 'presence_update':
        if (data.users) {
          setOnlineUsers(data.users);
        }
        if (data.stats) {
          setStreamStats(prev => ({ ...prev, ...data.stats }));
        }
        break;

      case 'analysis_started':
        setAnalysisStatus('analyzing');
        toast.info('🤖 AI threat analysis started...');
        break;

      case 'analysis_complete':
        setAnalysisStatus('complete');
        setTimeout(() => setAnalysisStatus('idle'), 3000);
        toast.success('✅ AI analysis completed');
        break;

      case 'analysis_results':
        if (data.results) {
          toast.success(`🎯 Analysis: ${data.results.processed_count || 0} threats processed`);
        }
        break;

      case 'analysis_error':
        setAnalysisStatus('error');
        setTimeout(() => setAnalysisStatus('idle'), 5000);
        toast.error('❌ AI analysis failed');
        break;

      case 'stream_stats_update':
        if (data.stats) {
          setStreamStats(data.stats);
        }
        break;

      case 'heartbeat_response':
        setConnectionState(prev => ({
          ...prev,
          lastHeartbeat: data.timestamp
        }));
        break;

      default:
        console.log('Unhandled enhanced message type:', data.type);
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

  const updatePresence = (status: UserPresence['status'], currentView?: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN && user) {
      wsRef.current.send(JSON.stringify({
        type: 'update_presence',
        status,
        current_view: currentView
      }));
    }
  };

  const getStatusIcon = () => {
    switch (connectionState.status) {
      case 'connected':
        if (analysisStatus === 'analyzing') {
          return <Brain className="w-4 h-4 text-blue-500 animate-pulse" />;
        }
        return <Wifi className="w-4 h-4 text-green-500" />;
      case 'connecting':
        return <Radio className="w-4 h-4 text-yellow-500 animate-pulse" />;
      case 'error':
        return <WifiOff className="w-4 h-4 text-red-500" />;
      default:
        return <WifiOff className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);
    
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    return `${Math.floor(diffSeconds / 3600)}h ago`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Enhanced Real-Time Intelligence
            {getStatusIcon()}
          </div>
          <div className="flex gap-2">
            {connectionState.status === 'connected' && (
              <>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={triggerAIAnalysis}
                  disabled={analysisStatus === 'analyzing'}
                >
                  <Brain className={`w-4 h-4 mr-2 ${analysisStatus === 'analyzing' ? 'animate-pulse' : ''}`} />
                  AI Analysis
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updatePresence('monitoring', 'realtime_dashboard')}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Monitor Mode
                </Button>
              </>
            )}
            <Button 
              size="sm" 
              onClick={connectionState.status === 'connected' ? disconnect : connect}
              variant={connectionState.status === 'connected' ? "destructive" : "default"}
              disabled={connectionState.status === 'connecting'}
            >
              {connectionState.status === 'connecting' ? 'Connecting...' :
               connectionState.status === 'connected' ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Enhanced Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{streamStats.connected_users}</div>
            <div className="text-sm text-muted-foreground">Connected</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{streamStats.active_users}</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">{streamStats.threats_processed}</div>
            <div className="text-sm text-muted-foreground">Processed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">{streamStats.analysis_queue}</div>
            <div className="text-sm text-muted-foreground">Analyzing</div>
          </div>
        </div>

        {/* User Presence */}
        {onlineUsers.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Online Users ({onlineUsers.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {onlineUsers.slice(0, 10).map((presence) => (
                <div key={presence.user_id} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">
                      {presence.name?.charAt(0) || presence.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <div className="font-medium">{presence.name || presence.email.split('@')[0]}</div>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${
                        presence.status === 'online' ? 'bg-green-500' :
                        presence.status === 'analyzing' ? 'bg-blue-500' :
                        'bg-yellow-500'
                      }`} />
                      <span className="text-xs text-muted-foreground capitalize">
                        {presence.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {onlineUsers.length > 10 && (
                <div className="flex items-center justify-center p-2 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                  +{onlineUsers.length - 10} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analysis Status */}
        {analysisStatus !== 'idle' && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <Brain className={`w-4 h-4 ${analysisStatus === 'analyzing' ? 'animate-pulse' : ''}`} />
            <span className="text-sm">
              AI Analysis: {
                analysisStatus === 'analyzing' ? 'Processing threats in real-time...' :
                analysisStatus === 'complete' ? 'Analysis complete - results available' :
                analysisStatus === 'error' ? 'Analysis failed - retrying...' : 'Ready'
              }
            </span>
          </div>
        )}

        {/* Real-time Threats Feed */}
        {realtimeThreats.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Live Threat Intelligence
              {lastUpdate && (
                <span className="text-sm text-muted-foreground">
                  • Updated {formatTimeAgo(lastUpdate)}
                </span>
              )}
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {realtimeThreats.map((threat, index) => (
                <div key={`${threat.id}-${index}`} className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{threat.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {threat.source_name} • {threat.country} • {threat.region}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={
                        threat.severity === 'critical' ? "destructive" :
                        threat.severity === 'high' ? "destructive" :
                        threat.severity === 'medium' ? "default" : "secondary"
                      }>
                        {threat.severity}
                      </Badge>
                      <Badge variant="outline">{threat.category}</Badge>
                      <span className="text-xs text-muted-foreground">
                        Score: {threat.threat_score}/100
                      </span>
                      {threat.confidence && (
                        <span className="text-xs text-blue-600">
                          Confidence: {threat.confidence}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatTimeAgo(threat.timestamp || threat.created_at)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Connection Details */}
        {connectionState.status === 'connected' && (
          <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted/30 rounded">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-green-600">Connected to enhanced stream</span>
            </div>
            {connectionState.connectionId && (
              <div className="flex justify-between">
                <span>Connection ID:</span>
                <span className="font-mono">{connectionState.connectionId.substring(0, 8)}...</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Subscriptions:</span>
              <span>{Array.from(subscriptions).join(', ')}</span>
            </div>
            {connectionState.lastHeartbeat && (
              <div className="flex justify-between">
                <span>Last heartbeat:</span>
                <span>{formatTimeAgo(connectionState.lastHeartbeat)}</span>
              </div>
            )}
          </div>
        )}

        {/* Disconnected State */}
        {connectionState.status === 'disconnected' && realtimeThreats.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Connect to enhanced real-time intelligence</p>
            <p className="text-sm mt-2">Get live threats, user presence, and AI analysis</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};