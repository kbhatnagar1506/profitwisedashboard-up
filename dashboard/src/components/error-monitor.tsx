"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  AlertTriangle, 
  RefreshCw, 
  Download, 
  Trash2, 
  CheckCircle,
  XCircle,
  Clock,
  Activity
} from 'lucide-react'
import { errorLogger, getUserFriendlyMessage, ProfitWiseError } from '@/lib/error-handler'

interface ErrorStats {
  total: number
  recent: Array<{
    error: ProfitWiseError
    timestamp: string
    userAgent: string
    url: string
  }>
}

export function ErrorMonitor() {
  const [errorStats, setErrorStats] = useState<ErrorStats>({ total: 0, recent: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const refreshErrorStats = () => {
    setIsLoading(true)
    try {
      const stats = errorLogger.getErrorStats()
      setErrorStats(stats)
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Failed to refresh error stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearErrorLog = () => {
    // Clear the error log (implementation would depend on your error logger)
    setErrorStats({ total: 0, recent: [] })
  }

  const exportErrorLog = () => {
    const dataStr = JSON.stringify(errorStats, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `profitwise-errors-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    refreshErrorStats()
    
    // Refresh every 30 seconds
    const interval = setInterval(refreshErrorStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const getErrorSeverity = (errorCode: string) => {
    switch (errorCode) {
      case 'AUTH_ERROR':
      case 'AUTHZ_ERROR':
        return 'high'
      case 'NETWORK_ERROR':
      case 'AI_ANALYSIS_ERROR':
        return 'medium'
      case 'VALIDATION_ERROR':
        return 'low'
      default:
        return 'medium'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'destructive'
      case 'medium':
        return 'default'
      case 'low':
        return 'secondary'
      default:
        return 'default'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Error Monitor</h2>
          <p className="text-muted-foreground">
            Monitor and track application errors and issues
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshErrorStats}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportErrorLog}
            disabled={errorStats.total === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearErrorLog}
            disabled={errorStats.total === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      {/* Error Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errorStats.total}</div>
            <p className="text-xs text-muted-foreground">
              Since last session
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Errors</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errorStats.recent.length}</div>
            <p className="text-xs text-muted-foreground">
              Last 10 errors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Severity</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {errorStats.recent.filter(e => getErrorSeverity(e.error.errorCode) === 'high').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Critical issues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Refresh</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {lastRefresh.toLocaleTimeString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Auto-refresh every 30s
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Error Details */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Errors</TabsTrigger>
          <TabsTrigger value="stats">Error Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          {errorStats.recent.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Errors Found
                  </h3>
                  <p className="text-muted-foreground">
                    Your application is running smoothly with no recent errors.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {errorStats.recent.map((errorLog, index) => {
                const severity = getErrorSeverity(errorLog.error.errorCode)
                return (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={getSeverityColor(severity) as any}>
                            {errorLog.error.errorCode}
                          </Badge>
                          <Badge variant="outline">
                            {severity.toUpperCase()}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatTimestamp(errorLog.timestamp)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-2">
                            <p className="font-medium">
                              {getUserFriendlyMessage(errorLog.error)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {errorLog.error.message}
                            </p>
                            {errorLog.error.details && Object.keys(errorLog.error.details).length > 0 && (
                              <details className="text-sm">
                                <summary className="cursor-pointer text-muted-foreground">
                                  Technical Details
                                </summary>
                                <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                                  {JSON.stringify(errorLog.error.details, null, 2)}
                                </pre>
                              </details>
                            )}
                            <div className="text-xs text-muted-foreground">
                              <p>Component: {errorLog.error.context.component}</p>
                              <p>Action: {errorLog.error.context.action}</p>
                              <p>URL: {errorLog.url}</p>
                            </div>
                          </div>
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Error Statistics</CardTitle>
              <CardDescription>
                Breakdown of errors by type and severity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {errorStats.recent.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No error data available
                  </p>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Error Types</h4>
                        <div className="space-y-1">
                          {Object.entries(
                            errorStats.recent.reduce((acc, errorLog) => {
                              const type = errorLog.error.errorCode
                              acc[type] = (acc[type] || 0) + 1
                              return acc
                            }, {} as Record<string, number>)
                          ).map(([type, count]) => (
                            <div key={type} className="flex justify-between text-sm">
                              <span>{type}</span>
                              <Badge variant="outline">{count}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Severity Distribution</h4>
                        <div className="space-y-1">
                          {['high', 'medium', 'low'].map(severity => {
                            const count = errorStats.recent.filter(
                              e => getErrorSeverity(e.error.errorCode) === severity
                            ).length
                            return (
                              <div key={severity} className="flex justify-between text-sm">
                                <span className="capitalize">{severity}</span>
                                <Badge variant={getSeverityColor(severity) as any}>
                                  {count}
                                </Badge>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
