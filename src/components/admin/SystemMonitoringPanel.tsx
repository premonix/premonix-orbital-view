import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { supabase } from '@/integrations/supabase/client'
import { Activity, Database, Wifi, Server, AlertTriangle, CheckCircle, Clock, RefreshCw } from 'lucide-react'

interface HealthStatus {
  timestamp: string
  overall_status: 'healthy' | 'warning' | 'error'
  response_time_ms: number
  services: {
    database?: ServiceStatus
    signal_ingestion?: ServiceStatus
    external_apis?: ServiceStatus
  }
}

interface ServiceStatus {
  status: 'healthy' | 'warning' | 'error'
  response_time_ms: number
  error?: string
  last_check: string
}

interface PipelineLog {
  id: string
  pipeline_name: string
  status: string
  records_processed: number
  error_message?: string
  execution_time_ms?: number
  created_at: string
  metadata?: any
}

export default function SystemMonitoringPanel() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null)
  const [pipelineLogs, setPipelineLogs] = useState<PipelineLog[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchHealthStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('health-check')
      
      if (error) {
        console.error('Health check error:', error)
        return
      }
      
      setHealthStatus(data)
    } catch (error) {
      console.error('Failed to fetch health status:', error)
    }
  }

  const fetchPipelineLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('data_pipeline_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Pipeline logs error:', error)
        return
      }

      setPipelineLogs(data || [])
    } catch (error) {
      console.error('Failed to fetch pipeline logs:', error)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await Promise.all([fetchHealthStatus(), fetchPipelineLogs()])
    setRefreshing(false)
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchHealthStatus(), fetchPipelineLogs()])
      setLoading(false)
    }

    loadData()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(refreshData, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">System Monitoring</h2>
          <p className="text-muted-foreground">Monitor system health and data pipeline status</p>
        </div>
        <Button
          onClick={refreshData}
          disabled={refreshing}
          size="sm"
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Overall Status */}
      {healthStatus && (
        <Alert className={healthStatus.overall_status !== 'healthy' ? 'border-red-200' : 'border-green-200'}>
          <div className="flex items-center gap-2">
            {getStatusIcon(healthStatus.overall_status)}
            <AlertDescription>
              System Status: <strong className="capitalize">{healthStatus.overall_status}</strong>
              {' '}(Response Time: {healthStatus.response_time_ms}ms)
              <br />
              <span className="text-sm text-muted-foreground">
                Last Updated: {new Date(healthStatus.timestamp).toLocaleString()}
              </span>
            </AlertDescription>
          </div>
        </Alert>
      )}

      <Tabs defaultValue="services" className="w-full">
        <TabsList>
          <TabsTrigger value="services">Service Health</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Database Status */}
            {healthStatus?.services.database && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Database
                  </CardTitle>
                  <Badge className={getStatusColor(healthStatus.services.database.status)}>
                    {healthStatus.services.database.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {healthStatus.services.database.response_time_ms}ms
                  </div>
                  <p className="text-xs text-muted-foreground">Response Time</p>
                  {healthStatus.services.database.error && (
                    <p className="text-xs text-red-500 mt-2">
                      {healthStatus.services.database.error}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Signal Ingestion Status */}
            {healthStatus?.services.signal_ingestion && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    Signal Ingestion
                  </CardTitle>
                  <Badge className={getStatusColor(healthStatus.services.signal_ingestion.status)}>
                    {healthStatus.services.signal_ingestion.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(healthStatus.services.signal_ingestion as any).minutes_since_last_run || 0}m
                  </div>
                  <p className="text-xs text-muted-foreground">Since Last Run</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last Status: {(healthStatus.services.signal_ingestion as any).last_run_status || 'Unknown'}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* External APIs Status */}
            {healthStatus?.services.external_apis && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Wifi className="h-4 w-4" />
                    External APIs
                  </CardTitle>
                  <Badge className={getStatusColor(healthStatus.services.external_apis.status)}>
                    {healthStatus.services.external_apis.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {healthStatus.services.external_apis.response_time_ms}ms
                  </div>
                  <p className="text-xs text-muted-foreground">Response Time</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>NewsAPI:</span>
                      <Badge className={getStatusColor((healthStatus.services.external_apis as any).news_api?.status || 'unknown')}>
                        {(healthStatus.services.external_apis as any).news_api?.status || 'unknown'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>GDELT:</span>
                      <Badge className={getStatusColor((healthStatus.services.external_apis as any).gdelt_api?.status || 'unknown')}>
                        {(healthStatus.services.external_apis as any).gdelt_api?.status || 'unknown'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Execution Logs</CardTitle>
              <CardDescription>Recent data ingestion pipeline executions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pipelineLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(log.status)}
                      <div>
                        <div className="font-medium">{log.pipeline_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(log.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {log.records_processed} records
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {log.execution_time_ms}ms
                      </div>
                    </div>
                    <Badge className={getStatusColor(log.status)}>
                      {log.status}
                    </Badge>
                  </div>
                ))}
                {pipelineLogs.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No pipeline logs available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}