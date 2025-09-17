"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts"
import { 
  TrendingUp, 
  TrendingDown, 
  Download, 
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from "lucide-react"

const revenueData = [
  { month: 'Jan', revenue: 40000, profit: 12000, customers: 120 },
  { month: 'Feb', revenue: 42000, profit: 13000, customers: 125 },
  { month: 'Mar', revenue: 38000, profit: 11000, customers: 118 },
  { month: 'Apr', revenue: 45000, profit: 14000, customers: 135 },
  { month: 'May', revenue: 47000, profit: 15000, customers: 142 },
  { month: 'Jun', revenue: 45231, profit: 12000, customers: 150 },
]

const customerSegments = [
  { name: 'Enterprise', value: 35, color: 'oklch(70% 0.15 220)' },
  { name: 'SMB', value: 45, color: 'oklch(70% 0.15 280)' },
  { name: 'Startup', value: 20, color: 'oklch(70% 0.15 320)' },
]

const productPerformance = [
  { name: 'Premium Plan', revenue: 12340, growth: 15.2, color: 'oklch(70% 0.15 140)' },
  { name: 'Basic Plan', revenue: 8560, growth: 8.7, color: 'oklch(70% 0.15 200)' },
  { name: 'Enterprise Plan', revenue: 21600, growth: 22.1, color: 'oklch(70% 0.15 280)' },
  { name: 'Starter Plan', revenue: 2340, growth: -2.3, color: 'oklch(70% 0.15 320)' },
]

const timeRanges = [
  { label: '6M', value: '6m' },
  { label: '12M', value: '12m' },
  { label: 'YTD', value: 'ytd' },
  { label: 'All', value: 'all' },
]

export function RevenueChart() {
  const [timeRange, setTimeRange] = useState('6m')
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>('area')

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Revenue Analytics
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border">
              {timeRanges.map((range) => (
                <Button
                  key={range.value}
                  variant={timeRange === range.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTimeRange(range.value)}
                  className="h-8 px-3"
                >
                  {range.label}
                </Button>
              ))}
            </div>
            <div className="flex rounded-lg border">
              <Button
                variant={chartType === 'area' ? "default" : "ghost"}
                size="sm"
                onClick={() => setChartType('area')}
                className="h-8 px-3"
              >
                <AreaChart className="h-4 w-4" />
              </Button>
              <Button
                variant={chartType === 'line' ? "default" : "ghost"}
                size="sm"
                onClick={() => setChartType('line')}
                className="h-8 px-3"
              >
                <Activity className="h-4 w-4" />
              </Button>
              <Button
                variant={chartType === 'bar' ? "default" : "ghost"}
                size="sm"
                onClick={() => setChartType('bar')}
                className="h-8 px-3"
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(70% 0.15 220)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="oklch(70% 0.15 220)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(70% 0.15 140)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="oklch(70% 0.15 140)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(65% 0.01 250)" />
                <XAxis 
                  dataKey="month" 
                  stroke="oklch(50% 0.01 250)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="oklch(50% 0.01 250)"
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'oklch(10% 0 0)',
                    border: '1px solid oklch(25% 0.01 250)',
                    borderRadius: '8px',
                    color: 'oklch(95% 0 0)'
                  }}
                  formatter={(value, name) => [
                    `$${Number(value).toLocaleString()}`,
                    name === 'revenue' ? 'Revenue' : 'Profit'
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="oklch(70% 0.15 220)"
                  fill="url(#revenueGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="oklch(70% 0.15 140)"
                  fill="url(#profitGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            ) : chartType === 'line' ? (
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(65% 0.01 250)" />
                <XAxis 
                  dataKey="month" 
                  stroke="oklch(50% 0.01 250)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="oklch(50% 0.01 250)"
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'oklch(10% 0 0)',
                    border: '1px solid oklch(25% 0.01 250)',
                    borderRadius: '8px',
                    color: 'oklch(95% 0 0)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="oklch(70% 0.15 220)"
                  strokeWidth={3}
                  dot={{ fill: 'oklch(70% 0.15 220)', strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="oklch(70% 0.15 140)"
                  strokeWidth={3}
                  dot={{ fill: 'oklch(70% 0.15 140)', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            ) : (
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(65% 0.01 250)" />
                <XAxis 
                  dataKey="month" 
                  stroke="oklch(50% 0.01 250)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="oklch(50% 0.01 250)"
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'oklch(10% 0 0)',
                    border: '1px solid oklch(25% 0.01 250)',
                    borderRadius: '8px',
                    color: 'oklch(95% 0 0)'
                  }}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="oklch(70% 0.15 220)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="profit" 
                  fill="oklch(70% 0.15 140)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
              <span className="text-sm font-medium">Revenue</span>
            </div>
            <div className="text-2xl font-bold">$45,231</div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-3 w-3" />
              +12.5% from last month
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-green-600"></div>
              <span className="text-sm font-medium">Profit</span>
            </div>
            <div className="text-2xl font-bold">$12,000</div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-3 w-3" />
              +8.2% from last month
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function CustomerSegmentsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5" />
          Customer Segments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={customerSegments}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {customerSegments.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'oklch(10% 0 0)',
                  border: '1px solid oklch(25% 0.01 250)',
                  borderRadius: '8px',
                  color: 'oklch(95% 0 0)'
                }}
                formatter={(value) => [`${value}%`, '']}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => <span className="text-sm">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-3 mt-4">
          {customerSegments.map((segment, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: segment.color }}
                ></div>
                <span className="text-sm font-medium">{segment.name}</span>
              </div>
              <Badge variant="secondary">{segment.value}%</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function ProductPerformanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Product Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {productPerformance.map((product, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{product.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">${product.revenue.toLocaleString()}</span>
                  <Badge 
                    variant={product.growth > 0 ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {product.growth > 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(product.growth)}%
                  </Badge>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${(product.revenue / Math.max(...productPerformance.map(p => p.revenue))) * 100}%`,
                    backgroundColor: product.color
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
