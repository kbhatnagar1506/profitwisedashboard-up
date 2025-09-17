"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { 
  Wallet, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  BarChart3, 
  PieChart as PieChartIcon,
  Clock,
  Target,
  Activity,
  CreditCard,
  Banknote,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  XCircle
} from "lucide-react"

const cashFlowData = [
  { 
    month: "Jan", 
    inflow: 45000, 
    outflow: 38000, 
    net: 7000, 
    operating: 42000, 
    investing: -5000, 
    financing: 8000,
    receivables: 12000,
    payables: 8000,
    inventory: 15000
  },
  { 
    month: "Feb", 
    inflow: 42000, 
    outflow: 36000, 
    net: 6000, 
    operating: 40000, 
    investing: -3000, 
    financing: 2000,
    receivables: 15000,
    payables: 12000,
    inventory: 18000
  },
  { 
    month: "Mar", 
    inflow: 48000, 
    outflow: 40000, 
    net: 8000, 
    operating: 45000, 
    investing: -2000, 
    financing: 5000,
    receivables: 18000,
    payables: 10000,
    inventory: 20000
  },
  { 
    month: "Apr", 
    inflow: 52000, 
    outflow: 42000, 
    net: 10000, 
    operating: 48000, 
    investing: -1000, 
    financing: 5000,
    receivables: 20000,
    payables: 12000,
    inventory: 22000
  },
  { 
    month: "May", 
    inflow: 49000, 
    outflow: 44000, 
    net: 5000, 
    operating: 45000, 
    investing: -2000, 
    financing: 1000,
    receivables: 22000,
    payables: 15000,
    inventory: 25000
  },
  { 
    month: "Jun", 
    inflow: 45000, 
    outflow: 41000, 
    net: 4000, 
    operating: 42000, 
    investing: -1000, 
    financing: 1000,
    receivables: 25000,
    payables: 18000,
    inventory: 28000
  },
  { 
    month: "Jul", 
    inflow: 47000, 
    outflow: 43000, 
    net: 4000, 
    operating: 44000, 
    investing: -2000, 
    financing: 1000,
    receivables: 28000,
    payables: 20000,
    inventory: 30000
  },
  { 
    month: "Aug", 
    inflow: 44000, 
    outflow: 45000, 
    net: -1000, 
    operating: 42000, 
    investing: -3000, 
    financing: 2000,
    receivables: 30000,
    payables: 25000,
    inventory: 32000
  },
]

const cashFlowProjections = [
  { month: "Sep", projected: 5000, optimistic: 8000, pessimistic: 2000, confidence: 75 },
  { month: "Oct", projected: 7000, optimistic: 12000, pessimistic: 3000, confidence: 80 },
  { month: "Nov", projected: 9000, optimistic: 15000, pessimistic: 5000, confidence: 85 },
  { month: "Dec", projected: 12000, optimistic: 18000, pessimistic: 8000, confidence: 90 },
]

const workingCapitalComponents = [
  { name: "Accounts Receivable", value: 30000, trend: "up", change: "+15%", days: 32 },
  { name: "Inventory", value: 32000, trend: "up", change: "+8%", days: 45 },
  { name: "Accounts Payable", value: 25000, trend: "up", change: "+12%", days: 28 },
  { name: "Cash & Equivalents", value: 45000, trend: "down", change: "-5%", days: 0 },
]

const cashFlowCategories = [
  { name: "Operating Activities", value: 85, color: "#10b981", amount: 340000 },
  { name: "Investing Activities", value: -8, color: "#ef4444", amount: -32000 },
  { name: "Financing Activities", value: 23, color: "#3b82f6", amount: 92000 },
]

const cashFlowMetrics = {
  currentRatio: 1.8,
  quickRatio: 1.2,
  cashConversionCycle: 49,
  daysSalesOutstanding: 32,
  daysPayableOutstanding: 28,
  daysInventoryOutstanding: 45,
  operatingCashFlow: 340000,
  freeCashFlow: 280000,
  cashRunway: 8.5
}

export function CashFlowAnalysis() {
  const [activeView, setActiveView] = useState<"overview" | "projections" | "working-capital" | "statements">("overview")

  return (
    <div className="space-y-6">
      {/* Main Cash Flow Dashboard */}
    <Card>
      <CardHeader>
          <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
              Cash Flow Analysis Dashboard
        </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant={activeView === "overview" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("overview")}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </Button>
              <Button
                variant={activeView === "projections" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("projections")}
              >
                <Target className="w-4 h-4 mr-2" />
                Projections
              </Button>
              <Button
                variant={activeView === "working-capital" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("working-capital")}
              >
                <Activity className="w-4 h-4 mr-2" />
                Working Capital
              </Button>
              <Button
                variant={activeView === "statements" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("statements")}
              >
                <Receipt className="w-4 h-4 mr-2" />
                Statements
              </Button>
            </div>
          </div>
      </CardHeader>
      <CardContent className="space-y-6">
          {/* Key Cash Flow Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700 dark:text-green-300">Operating Cash Flow</span>
              </div>
              <p className="text-2xl font-bold text-green-800 dark:text-green-200">$340K</p>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-green-600 dark:text-green-400">YTD operating cash flow</p>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700 dark:text-blue-300">Free Cash Flow</span>
              </div>
              <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">$280K</p>
              <Progress value={75} className="h-2" />
              <p className="text-xs text-blue-600 dark:text-blue-400">Available for growth</p>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-purple-700 dark:text-purple-300">Cash Runway</span>
              </div>
              <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">8.5 mo</p>
              <Progress value={70} className="h-2" />
              <p className="text-xs text-purple-600 dark:text-purple-400">At current burn rate</p>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-orange-700 dark:text-orange-300">Conversion Cycle</span>
              </div>
              <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">49 days</p>
              <Progress value={60} className="h-2" />
              <p className="text-xs text-orange-600 dark:text-orange-400">Cash conversion cycle</p>
          </div>
          </div>

          {/* Dynamic Content Based on Active View */}
          {activeView === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Cash Flow Trends
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cashFlowData}>
                      <defs>
                        <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
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
                      <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="2 2" />
                      <Area type="monotone" dataKey="inflow" stroke="#10b981" fill="url(#colorInflow)" strokeWidth={2} />
                      <Area type="monotone" dataKey="outflow" stroke="#ef4444" fill="url(#colorOutflow)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
          </div>
        </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4" />
                  Cash Flow Categories
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={cashFlowCategories}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${Math.abs(value)}%`}
                      >
                        {cashFlowCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeView === "projections" && (
            <div className="space-y-6">
              <h4 className="font-semibold">Cash Flow Projections</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[...cashFlowData, ...cashFlowProjections]}>
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
              <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="2 2" />
                    <Line type="monotone" dataKey="net" stroke="#3b82f6" strokeWidth={3} name="Actual" />
                    <Line type="monotone" dataKey="projected" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="Projected" />
                    <Line type="monotone" dataKey="optimistic" stroke="#22c55e" strokeWidth={1} strokeDasharray="3 3" name="Optimistic" />
                    <Line type="monotone" dataKey="pessimistic" stroke="#ef4444" strokeWidth={1} strokeDasharray="3 3" name="Pessimistic" />
            </LineChart>
          </ResponsiveContainer>
        </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/30">
                  <h5 className="font-medium mb-2">Q4 Projection</h5>
                  <p className="text-2xl font-bold text-green-600">$33K</p>
                  <p className="text-xs text-muted-foreground">Expected net cash flow</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <h5 className="font-medium mb-2">Confidence Level</h5>
                  <p className="text-2xl font-bold text-blue-600">85%</p>
                  <p className="text-xs text-muted-foreground">Average confidence</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <h5 className="font-medium mb-2">Risk Assessment</h5>
                  <p className="text-2xl font-bold text-orange-600">Medium</p>
                  <p className="text-xs text-muted-foreground">Projection risk level</p>
                </div>
              </div>
            </div>
          )}

          {activeView === "working-capital" && (
            <div className="space-y-6">
              <h4 className="font-semibold">Working Capital Analysis</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium mb-4">Working Capital Components</h5>
        <div className="space-y-3">
                    {workingCapitalComponents.map((component, index) => (
                      <div key={index} className="p-4 rounded-lg bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{component.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">${component.value.toLocaleString()}</span>
                            <Badge variant={component.trend === "up" ? "default" : "secondary"}>
                              {component.change}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{component.days} days</span>
                          <div className="flex items-center gap-1">
                            {component.trend === "up" ? (
                              <ArrowUpRight className="w-3 h-3 text-green-500" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3 text-red-500" />
                            )}
                            <span>{component.trend === "up" ? "Increasing" : "Decreasing"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
            <div>
                  <h5 className="font-medium mb-4">Working Capital Metrics</h5>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Current Ratio</span>
                        <span className="text-xl font-bold text-blue-600">{cashFlowMetrics.currentRatio}</span>
                      </div>
                      <Progress value={cashFlowMetrics.currentRatio * 20} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">Liquidity measure</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Quick Ratio</span>
                        <span className="text-xl font-bold text-green-600">{cashFlowMetrics.quickRatio}</span>
                      </div>
                      <Progress value={cashFlowMetrics.quickRatio * 20} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">Acid test ratio</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Cash Conversion Cycle</span>
                        <span className="text-xl font-bold text-purple-600">{cashFlowMetrics.cashConversionCycle} days</span>
                      </div>
                      <Progress value={cashFlowMetrics.cashConversionCycle} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">Days to convert to cash</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === "statements" && (
            <div className="space-y-6">
              <h4 className="font-semibold">Cash Flow Statement</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Category</th>
                      <th className="text-right p-3 font-medium">Amount</th>
                      <th className="text-right p-3 font-medium">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Operating Activities</td>
                      <td className="text-right p-3 font-bold text-green-600">$340,000</td>
                      <td className="text-right p-3 text-green-600">+12%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 pl-6">Net Income</td>
                      <td className="text-right p-3">$280,000</td>
                      <td className="text-right p-3 text-green-600">+8%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 pl-6">Depreciation</td>
                      <td className="text-right p-3">$45,000</td>
                      <td className="text-right p-3 text-green-600">+5%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 pl-6">Working Capital Changes</td>
                      <td className="text-right p-3">$15,000</td>
                      <td className="text-right p-3 text-red-600">-3%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Investing Activities</td>
                      <td className="text-right p-3 font-bold text-red-600">-$32,000</td>
                      <td className="text-right p-3 text-red-600">-15%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 pl-6">Capital Expenditures</td>
                      <td className="text-right p-3">-$25,000</td>
                      <td className="text-right p-3 text-red-600">-10%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 pl-6">Investments</td>
                      <td className="text-right p-3">-$7,000</td>
                      <td className="text-right p-3 text-green-600">+20%</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Financing Activities</td>
                      <td className="text-right p-3 font-bold text-blue-600">$92,000</td>
                      <td className="text-right p-3 text-green-600">+25%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Cash Flow Alerts */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Cash Flow Warning</p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  Projected negative cash flow in August. Consider accelerating receivables or delaying payables.
                </p>
            </div>
          </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Days Sales Outstanding</p>
                <p className="text-lg font-semibold">{cashFlowMetrics.daysSalesOutstanding} days</p>
              <Badge variant="secondary" className="mt-1">
                Industry avg: 45
              </Badge>
            </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Days Payable Outstanding</p>
                <p className="text-lg font-semibold">{cashFlowMetrics.daysPayableOutstanding} days</p>
                <Badge variant="secondary" className="mt-1">
                  Industry avg: 30
                </Badge>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Days Inventory Outstanding</p>
                <p className="text-lg font-semibold">{cashFlowMetrics.daysInventoryOutstanding} days</p>
                <Badge variant="secondary" className="mt-1">
                  Industry avg: 50
                </Badge>
              </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Cash Runway</p>
                <p className="text-lg font-semibold">{cashFlowMetrics.cashRunway} months</p>
              <Badge variant="secondary" className="mt-1">
                At current burn
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

      {/* Additional Cash Flow Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Cash Flow Alerts & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="font-medium text-red-800 dark:text-red-200">Critical Alert</span>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300">
                August shows negative cash flow. Immediate action required to prevent liquidity issues.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-yellow-800 dark:text-yellow-200">Optimization Opportunity</span>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Accounts receivable increased 15%. Consider implementing automated payment reminders.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-200">Positive Trend</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Operating cash flow is strong at $340K. Good foundation for growth investments.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Cash Flow Health Score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">78/100</div>
              <p className="text-sm text-muted-foreground">Overall Cash Flow Health</p>
              <Progress value={78} className="mt-2" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Liquidity</span>
                <Badge variant="secondary">Good</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Cash Generation</span>
                <Badge variant="secondary">Excellent</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Working Capital</span>
                <Badge variant="secondary">Good</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Cash Management</span>
                <Badge variant="secondary">Good</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
