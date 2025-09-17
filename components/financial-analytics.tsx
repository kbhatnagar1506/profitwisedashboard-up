"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { TrendingUp, DollarSign, CreditCard, Calendar, Download, Filter } from "lucide-react"

const revenueData = [
  { month: "Jan", revenue: 42000, costs: 28000, profit: 14000, forecast: 44000 },
  { month: "Feb", revenue: 38000, costs: 26000, profit: 12000, forecast: 40000 },
  { month: "Mar", revenue: 45000, costs: 30000, profit: 15000, forecast: 47000 },
  { month: "Apr", revenue: 48000, costs: 32000, profit: 16000, forecast: 50000 },
  { month: "May", revenue: 52000, costs: 34000, profit: 18000, forecast: 54000 },
  { month: "Jun", revenue: 45000, costs: 33000, profit: 12000, forecast: 47000 },
  { month: "Jul", revenue: 0, costs: 0, profit: 0, forecast: 58000 },
  { month: "Aug", revenue: 0, costs: 0, profit: 0, forecast: 61000 },
]

const expenseBreakdown = [
  { category: "Marketing", amount: 12000, percentage: 35 },
  { category: "Operations", amount: 8500, percentage: 25 },
  { category: "Salaries", amount: 10200, percentage: 30 },
  { category: "Other", amount: 3400, percentage: 10 },
]

export function FinancialAnalytics() {
  const [viewMode, setViewMode] = useState<"revenue" | "expenses">("revenue")
  const [timeRange, setTimeRange] = useState<"6m" | "12m" | "ytd">("6m")

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Financial Analytics
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "revenue" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("revenue")}
            >
              Revenue
            </Button>
            <Button
              variant={viewMode === "expenses" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("expenses")}
            >
              Expenses
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Button variant={timeRange === "6m" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("6m")}>
              6M
            </Button>
            <Button variant={timeRange === "12m" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("12m")}>
              12M
            </Button>
            <Button variant={timeRange === "ytd" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("ytd")}>
              YTD
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700 dark:text-green-300">Revenue Growth</span>
            </div>
            <p className="text-2xl font-bold text-green-800 dark:text-green-200">+12.5%</p>
            <Progress value={75} className="h-2" />
            <p className="text-xs text-green-600 dark:text-green-400">vs last period</p>
          </div>
          <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-700 dark:text-blue-300">Profit Margin</span>
            </div>
            <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">26.7%</p>
            <Progress value={67} className="h-2" />
            <p className="text-xs text-blue-600 dark:text-blue-400">Industry avg: 22%</p>
          </div>
          <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-purple-700 dark:text-purple-300">Cash Flow</span>
            </div>
            <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">$18K</p>
            <Progress value={85} className="h-2" />
            <p className="text-xs text-purple-600 dark:text-purple-400">Positive trend</p>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === "revenue" ? (
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                  strokeWidth={2}
                />
                <Line type="monotone" dataKey="forecast" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            ) : (
              <LineChart data={expenseBreakdown}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="category" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Key Financial Metrics</h4>
            <Badge variant="outline" className="text-xs">
              Updated 2h ago
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
              <span className="text-sm font-medium">Customer Acquisition Cost</span>
              <div className="text-right">
                <Badge variant="secondary" className="mb-1">
                  $180
                </Badge>
                <p className="text-xs text-green-600">↓ 15% vs last month</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
              <span className="text-sm font-medium">Customer Lifetime Value</span>
              <div className="text-right">
                <Badge variant="secondary" className="mb-1">
                  $2,400
                </Badge>
                <p className="text-xs text-green-600">↑ 8% vs last month</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
              <span className="text-sm font-medium">Payback Period</span>
              <div className="text-right">
                <Badge variant="secondary" className="mb-1">
                  3.2 months
                </Badge>
                <p className="text-xs text-blue-600">Optimal range</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
              <span className="text-sm font-medium">Monthly Recurring Revenue</span>
              <div className="text-right">
                <Badge variant="secondary" className="mb-1">
                  $45K
                </Badge>
                <p className="text-xs text-green-600">↑ 12% growth</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
