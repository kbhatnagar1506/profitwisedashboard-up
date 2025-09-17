"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, DollarSign, CreditCard, Calendar, Download, Filter, AlertTriangle, Target, TrendingDown, Calculator, PieChart as PieChartIcon, BarChart3 } from "lucide-react"

const revenueData = [
  { month: "Jan", revenue: 42000, costs: 28000, profit: 14000, forecast: 44000, newCustomers: 25, churn: 8 },
  { month: "Feb", revenue: 38000, costs: 26000, profit: 12000, forecast: 40000, newCustomers: 18, churn: 12 },
  { month: "Mar", revenue: 45000, costs: 30000, profit: 15000, forecast: 47000, newCustomers: 32, churn: 6 },
  { month: "Apr", revenue: 48000, costs: 32000, profit: 16000, forecast: 50000, newCustomers: 28, churn: 9 },
  { month: "May", revenue: 52000, costs: 34000, profit: 18000, forecast: 54000, newCustomers: 35, churn: 7 },
  { month: "Jun", revenue: 45000, costs: 33000, profit: 12000, forecast: 47000, newCustomers: 22, churn: 15 },
  { month: "Jul", revenue: 0, costs: 0, profit: 0, forecast: 58000, newCustomers: 0, churn: 0 },
  { month: "Aug", revenue: 0, costs: 0, profit: 0, forecast: 61000, newCustomers: 0, churn: 0 },
]

const expenseBreakdown = [
  { category: "Marketing", amount: 12000, percentage: 35, trend: "up", budget: 15000 },
  { category: "Operations", amount: 8500, percentage: 25, trend: "stable", budget: 9000 },
  { category: "Salaries", amount: 10200, percentage: 30, trend: "up", budget: 10000 },
  { category: "Technology", amount: 3200, percentage: 9, trend: "down", budget: 4000 },
  { category: "Other", amount: 1200, percentage: 1, trend: "stable", budget: 2000 },
]

const revenueStreams = [
  { name: "Product Sales", value: 28000, color: "#10b981" },
  { name: "Service Revenue", value: 12000, color: "#3b82f6" },
  { name: "Subscription", value: 8000, color: "#8b5cf6" },
  { name: "Consulting", value: 5000, color: "#f59e0b" },
]

const financialHealth = {
  currentRatio: 2.3,
  quickRatio: 1.8,
  debtToEquity: 0.4,
  grossMargin: 0.267,
  netMargin: 0.156,
  roe: 0.23,
  roa: 0.18
}

export function FinancialAnalytics() {
  const [viewMode, setViewMode] = useState<"revenue" | "expenses" | "profitability" | "health">("revenue")
  const [timeRange, setTimeRange] = useState<"6m" | "12m" | "ytd">("6m")

  return (
    <div className="space-y-6">
      {/* Main Financial Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Financial Analytics Dashboard
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
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
                <DollarSign className="w-4 h-4 mr-2" />
                Revenue
              </Button>
              <Button
                variant={viewMode === "expenses" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("expenses")}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Expenses
              </Button>
              <Button
                variant={viewMode === "profitability" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("profitability")}
              >
                <Target className="w-4 h-4 mr-2" />
                Profitability
              </Button>
              <Button
                variant={viewMode === "health" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("health")}
              >
                <Calculator className="w-4 h-4 mr-2" />
                Health
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

          {/* Key Financial Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
            <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-orange-700 dark:text-orange-300">ROI</span>
              </div>
              <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">23%</p>
              <Progress value={80} className="h-2" />
              <p className="text-xs text-orange-600 dark:text-orange-400">Above target</p>
            </div>
          </div>

          {/* Dynamic Content Based on View Mode */}
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
              ) : viewMode === "expenses" ? (
                <BarChart data={expenseBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="category" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="amount" fill="#ef4444" />
                </BarChart>
              ) : viewMode === "profitability" ? (
                <PieChart>
                  <Pie
                    data={revenueStreams}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {revenueStreams.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              ) : (
                <LineChart data={Object.entries(financialHealth).map(([key, value]) => ({ metric: key, value }))}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="metric" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Detailed Financial Metrics */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Key Financial Metrics</h4>
              <Badge variant="outline" className="text-xs">
                Updated 2h ago
              </Badge>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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

      {/* Additional Financial Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Financial Alerts & Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-yellow-800 dark:text-yellow-200">Budget Alert</span>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Marketing expenses are 20% over budget this month. Consider reallocating funds.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-200">Positive Trend</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Profit margins have improved by 2.1% this quarter, exceeding industry average.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800 dark:text-blue-200">Growth Opportunity</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Subscription revenue shows 15% growth potential with current customer base.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Financial Health Score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">85/100</div>
              <p className="text-sm text-muted-foreground">Overall Financial Health</p>
              <Progress value={85} className="mt-2" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Liquidity Ratio</span>
                <Badge variant="secondary">Excellent</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Debt Management</span>
                <Badge variant="secondary">Good</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Profitability</span>
                <Badge variant="secondary">Excellent</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Growth Rate</span>
                <Badge variant="secondary">Good</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
