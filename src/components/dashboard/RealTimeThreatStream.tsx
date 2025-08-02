import { useEffect, useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Zap, 
  Brain, 
  Globe, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

interface ThreatUpdate {
  type: string;
  threat?: any;
  threats?: any[];
  timestamp: string;
  count?: number;
}

interface ConnectionStatus {
  connected: boolean;
  lastHeartbeat?: string;
  connectionId?: string;
}

export const RealTimeThreatStream = () => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({ connected: false });
  const [realtimeThreats, setRealtimeThreats] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [aiAnalysisStatus, setAiAnalysisStatus] = useState<string>('idle');
  const [streamStats, setStreamStats] = useState({
    totalReceived: 0,
    highSeverityCount: 0,
    categoryCounts: {} as Record<string, number>
  });

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  const connect = () => {
    try {
      console.log('Connecting to real-time threat stream...');
      
      // Use full WebSocket URL for Supabase edge function
      const wsUrl = `wss://eydehwbjzpanyzzshgyd.functions.supabase.co/realtime-threat-stream`;
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected successfully');
        setIsConnected(true);
        setConnectionStatus({ connected: true });
        
        // Subscribe to threat updates
        wsRef.current?.send(JSON.stringify({
          type: 'subscribe_threats',
          filters: {
            severity: ['high', 'critical'],
            categories: ['Cyber', 'Military', 'Economic']
          }
        }));

        if (user) {
          // Subscribe to user alerts
          wsRef.current?.send(JSON.stringify({
            type: 'subscribe_alerts',
            user_id: user.id
          }));
        }

        // Start heartbeat
        startHeartbeat();
        
        toast.success('Connected to real-time threat intelligence stream');
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data: ThreatUpdate = JSON.parse(event.data);
          console.log('Received real-time update:', data.type);
          
          handleMessage(data);
          
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        setIsConnected(false);
        setConnectionStatus({ connected: false });
        
        // Attempt to reconnect after delay
        if (event.code !== 1000) { // Not a normal closure
          setTimeout(() => {
            if (!isConnected) {
              console.log('Attempting to reconnect...');
              connect();
            }
          }, 5000);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast.error('Real-time connection error');
      };

    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      toast.error('Failed to connect to real-time stream');
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close(1000, 'User disconnected');
      wsRef.current = null;
    }
    setIsConnected(false);
    setConnectionStatus({ connected: false });
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
    }, 30000); // Every 30 seconds
  };

  const handleMessage = (data: ThreatUpdate) => {
    setLastUpdate(data.timestamp);

    switch (data.type) {
      case 'connection_established':
        setConnectionStatus({
          connected: true,
          connectionId: (data as any).connection_id
        });
        break;

      case 'threat_update':
        if (data.threats) {
          setRealtimeThreats(data.threats.slice(0, 10)); // Keep last 10
          updateStreamStats(data.threats);
        }
        break;

      case 'new_threat':
        if (data.threat) {
          setRealtimeThreats(prev => [data.threat, ...prev.slice(0, 9)]);
          updateStreamStats([data.threat]);
          
          // Show notification for high-severity threats
          if (['high', 'critical'].includes(data.threat.severity)) {
            toast.warning(`New ${data.threat.severity} threat detected: ${data.threat.title.substring(0, 50)}...`);
          }
        }
        break;

      case 'analysis_started':
        setAiAnalysisStatus('analyzing');
        break;

      case 'analysis_complete':
        setAiAnalysisStatus('complete');
        setTimeout(() => setAiAnalysisStatus('idle'), 3000);
        break;

      case 'analysis_error':
        setAiAnalysisStatus('error');
        setTimeout(() => setAiAnalysisStatus('idle'), 5000);
        break;

      case 'heartbeat_response':
        setConnectionStatus(prev => ({
          ...prev,
          lastHeartbeat: data.timestamp
        }));
        break;

      default:
        console.log('Unhandled message type:', data.type);
    }
  };

  const updateStreamStats = (threats: any[]) => {
    setStreamStats(prev => {
      const newStats = { ...prev };
      
      threats.forEach(threat => {
        newStats.totalReceived++;
        
        if (['high', 'critical'].includes(threat.severity)) {
          newStats.highSeverityCount++;
        }
        
        const category = threat.category || 'Other';
        newStats.categoryCounts[category] = (newStats.categoryCounts[category] || 0) + 1;
      });
      
      return newStats;
    });
  };

  const triggerAIAnalysis = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'trigger_analysis'
      }));
      setAiAnalysisStatus('triggered');
    }
  };

  const getStatusIcon = () => {
    if (!isConnected) return <XCircle className="w-4 h-4 text-red-500" />;
    if (aiAnalysisStatus === 'analyzing') return <Brain className="w-4 h-4 text-blue-500 animate-pulse" />;
    return <CheckCircle className="w-4 h-4 text-green-500" />;
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
            Real-Time Intelligence Stream
            {getStatusIcon()}
          </div>
          <div className="flex gap-2">
            {isConnected && (
              <Button size="sm" variant="outline" onClick={triggerAIAnalysis}>
                <Brain className="w-4 h-4 mr-2" />
                AI Analysis
              </Button>
            )}
            <Button 
              size="sm" 
              onClick={isConnected ? disconnect : connect}
              variant={isConnected ? "destructive" : "default"}
            >
              {isConnected ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{streamStats.totalReceived}</div>
            <div className="text-sm text-muted-foreground">Total Received</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{streamStats.highSeverityCount}</div>
            <div className="text-sm text-muted-foreground">High Severity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">
              {Object.keys(streamStats.categoryCounts).length}
            </div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </div>
        </div>

        {/* AI Analysis Status */}
        {aiAnalysisStatus !== 'idle' && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <Brain className={`w-4 h-4 ${aiAnalysisStatus === 'analyzing' ? 'animate-pulse' : ''}`} />
            <span className="text-sm">
              AI Analysis: {aiAnalysisStatus === 'analyzing' ? 'Processing threats...' : 
                          aiAnalysisStatus === 'complete' ? 'Analysis complete' :
                          aiAnalysisStatus === 'error' ? 'Analysis failed' : 'Triggered'}
            </span>
          </div>
        )}

        {/* Real-time Threats */}
        {realtimeThreats.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Live Threat Feed
              {lastUpdate && (
                <span className="text-sm text-muted-foreground">
                  • Last update: {formatTimeAgo(lastUpdate)}
                </span>
              )}
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {realtimeThreats.map((threat, index) => (
                <div key={`${threat.id}-${index}`} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{threat.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {threat.source_name} • {threat.country}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={threat.severity === 'high' || threat.severity === 'critical' ? "destructive" : "secondary"}>
                        {threat.severity}
                      </Badge>
                      <Badge variant="outline">{threat.category}</Badge>
                      <span className="text-xs text-muted-foreground">
                        Score: {threat.threat_score}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatTimeAgo(threat.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Connection Details */}
        {isConnected && (
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Status: Connected to real-time stream</div>
            {connectionStatus.connectionId && (
              <div>Connection ID: {connectionStatus.connectionId.substring(0, 8)}...</div>
            )}
            {connectionStatus.lastHeartbeat && (
              <div>Last heartbeat: {formatTimeAgo(connectionStatus.lastHeartbeat)}</div>
            )}
          </div>
        )}

        {!isConnected && realtimeThreats.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Connect to receive real-time threat intelligence</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};