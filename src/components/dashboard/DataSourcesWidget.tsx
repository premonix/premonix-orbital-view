import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  RefreshCw, 
  Database, 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Globe,
  Rss,
  Zap
} from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  source_type: string;
  endpoint_url: string;
  refresh_interval_minutes: number;
  is_active: boolean;
  last_fetch_at: string | null;
  last_error: string | null;
  created_at: string;
}

interface IngestionLog {
  id: string;
  data_source_id: string;
  status: string;
  records_processed: number;
  records_inserted: number;
  execution_time_ms: number;
  error_message: string | null;
  started_at: string;
  completed_at: string | null;
}

export const DataSourcesWidget = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [recentLogs, setRecentLogs] = useState<IngestionLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isIngesting, setIsIngesting] = useState(false);

  useEffect(() => {
    fetchDataSources();
    fetchRecentLogs();
  }, []);

  const fetchDataSources = async () => {
    try {
      const { data, error } = await supabase
        .from('data_sources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDataSources(data || []);
    } catch (error) {
      console.error('Error fetching data sources:', error);
      toast.error('Failed to load data sources');
    }
  };

  const fetchRecentLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('data_ingestion_logs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecentLogs(data || []);
    } catch (error) {
      console.error('Error fetching ingestion logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerManualIngestion = async () => {
    setIsIngesting(true);
    try {
      const { data, error } = await supabase.functions.invoke('threat-feed-ingestion', {
        body: { manual: true }
      });

      if (error) throw error;

      toast.success('Threat feed ingestion completed successfully');
      await fetchRecentLogs();
      await fetchDataSources();
    } catch (error: any) {
      console.error('Error triggering ingestion:', error);
      toast.error(`Ingestion failed: ${error.message}`);
    } finally {
      setIsIngesting(false);
    }
  };

  const getSourceIcon = (sourceType: string) => {
    switch (sourceType) {
      case 'api': return <Database className="w-4 h-4" />;
      case 'rss': return <Rss className="w-4 h-4" />;
      case 'webhook': return <Zap className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (source: DataSource) => {
    if (!source.is_active) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    
    if (source.last_error) {
      return <Badge variant="destructive">Error</Badge>;
    }
    
    if (!source.last_fetch_at) {
      return <Badge variant="outline">Never Run</Badge>;
    }
    
    const lastFetch = new Date(source.last_fetch_at);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastFetch.getTime()) / (1000 * 60);
    
    if (diffMinutes > source.refresh_interval_minutes * 2) {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    
    return <Badge variant="default">Active</Badge>;
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeSources = dataSources.filter(s => s.is_active).length;
  const sourcesWithErrors = dataSources.filter(s => s.last_error).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Sources
          </div>
          <Button 
            size="sm" 
            onClick={triggerManualIngestion}
            disabled={isIngesting}
          >
            {isIngesting ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Ingest Now
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{activeSources}</div>
            <div className="text-sm text-muted-foreground">Active Sources</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{sourcesWithErrors}</div>
            <div className="text-sm text-muted-foreground">With Errors</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{dataSources.length - sourcesWithErrors}</div>
            <div className="text-sm text-muted-foreground">Healthy</div>
          </div>
        </div>

        {/* Data Sources List */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Source Status
          </h4>
          {dataSources.map((source) => (
            <div key={source.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getSourceIcon(source.source_type)}
                <div>
                  <div className="font-medium">{source.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Refresh every {source.refresh_interval_minutes}m
                    {source.last_fetch_at && (
                      <span className="ml-2">• Last: {formatTimeAgo(source.last_fetch_at)}</span>
                    )}
                  </div>
                  {source.last_error && (
                    <div className="text-sm text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {source.last_error.substring(0, 60)}...
                    </div>
                  )}
                </div>
              </div>
              {getStatusBadge(source)}
            </div>
          ))}
        </div>

        {/* Recent Ingestion Logs */}
        {recentLogs.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent Activity
            </h4>
            <div className="space-y-2">
              {recentLogs.slice(0, 5).map((log) => {
                const source = dataSources.find(s => s.id === log.data_source_id);
                const isCompleted = log.status === 'completed';
                const hasError = log.status === 'failed' || log.error_message;
                
                return (
                  <div key={log.id} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                    <div className="flex items-center gap-2">
                      {hasError ? (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      ) : isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                      )}
                      <div>
                        <div className="text-sm font-medium">{source?.name || 'Unknown Source'}</div>
                        <div className="text-xs text-muted-foreground">
                          {isCompleted && (
                            <>
                              {log.records_inserted}/{log.records_processed} signals • {formatDuration(log.execution_time_ms)} • 
                            </>
                          )}
                          {formatTimeAgo(log.started_at)}
                        </div>
                      </div>
                    </div>
                    <Badge variant={hasError ? "destructive" : isCompleted ? "default" : "secondary"}>
                      {log.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};