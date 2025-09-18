"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, Users, AlertTriangle, Loader2 } from "lucide-react"
import { dataService, type DashboardData } from "@/lib/data-service"

export function BusinessHealthOverview() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await dataService.fetchDashboardData()
        setData(dashboardData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <Card className="border-2 border-green-500/20 bg-card">
        <CardHeader>
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading business data...</span>
          </div>
        </CardHeader>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card className="border-2 border-red-500/20 bg-card">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            Unable to load business data
          </CardTitle>
        </CardHeader>
      </Card>
    )
  }

  const { business_info, financial_metrics, health_score } = data
  
  // Calculate growth percentage (mock for now)
  const revenueGrowth = 12 // This would be calculated from historical data
  
  const getHealthStatus = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'green' }
    if (score >= 60) return { label: 'Good', color: 'blue' }
    if (score >= 40) return { label: 'Fair', color: 'yellow' }
    return { label: 'Needs Attention', color: 'red' }
  }

  const healthStatus = getHealthStatus(health_score)
  return (
    <Card className={`border-2 ${healthStatus.color === 'green' ? 'border-green-500/20' : healthStatus.color === 'blue' ? 'border-blue-500/20' : healthStatus.color === 'yellow' ? 'border-yellow-500/20' : 'border-red-500/20'} bg-card`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <div className={`w-3 h-3 ${healthStatus.color === 'green' ? 'bg-green-500' : healthStatus.color === 'blue' ? 'bg-blue-500' : healthStatus.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'} rounded-full`}></div>
            Business Health: {health_score}%
          </CardTitle>
          <Badge variant="secondary" className={`${healthStatus.color === 'green' ? 'bg-green-500/10 text-foreground border-green-500/20' : healthStatus.color === 'blue' ? 'bg-blue-500/10 text-foreground border-blue-500/20' : healthStatus.color === 'yellow' ? 'bg-yellow-500/10 text-foreground border-yellow-500/20' : 'bg-red-500/10 text-foreground border-red-500/20'}`}>
            {healthStatus.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Progress value={health_score} className="h-3" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
            <div className="p-2 rounded-lg bg-green-500/10">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="text-lg font-semibold">${(financial_metrics.monthly_revenue / 1000).toFixed(0)}K/mo</p>
              <p className="text-xs text-green-400">+{revenueGrowth}% vs last month</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Profit</p>
              <p className="text-lg font-semibold">${(financial_metrics.monthly_revenue * financial_metrics.profit_margin / 100 / 1000).toFixed(0)}K/mo</p>
              <p className="text-xs text-blue-400">{financial_metrics.profit_margin.toFixed(1)}% margin</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Customers</p>
              <p className="text-lg font-semibold">{financial_metrics.estimated_customers}</p>
              <p className="text-xs text-purple-400">+8 this month</p>
            </div>
          </div>
        </div>

        {data.alerts && data.alerts.length > 0 && (
          <div className="space-y-2">
            {data.alerts.map((alert, index) => (
              <div key={index} className={`flex items-center gap-2 p-3 rounded-lg ${alert.type === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/20' : alert.type === 'error' ? 'bg-red-500/10 border border-red-500/20' : alert.type === 'info' ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-green-500/10 border border-green-500/20'}`}>
                <AlertTriangle className={`w-4 h-4 ${alert.type === 'warning' ? 'text-yellow-500' : alert.type === 'error' ? 'text-red-500' : alert.type === 'info' ? 'text-blue-500' : 'text-green-500'}`} />
                <p className={`text-sm ${alert.type === 'warning' ? 'text-yellow-700 dark:text-yellow-300' : alert.type === 'error' ? 'text-red-700 dark:text-red-300' : alert.type === 'info' ? 'text-blue-700 dark:text-blue-300' : 'text-green-700 dark:text-green-300'}`}>
                  <strong>{alert.title}:</strong> {alert.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
