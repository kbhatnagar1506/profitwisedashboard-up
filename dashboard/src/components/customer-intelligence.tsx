"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts"
import { Users, UserCheck, Star, TrendingUp, Target, Award } from "lucide-react"

const customerSegments = [
  { name: "Premium", value: 30, color: "#10b981", revenue: 180000 },
  { name: "Standard", value: 45, color: "#3b82f6", revenue: 135000 },
  { name: "Basic", value: 25, color: "#f59e0b", revenue: 50000 },
]

const retentionData = [
  { month: "Jan", retained: 92, churned: 8, newCustomers: 15 },
  { month: "Feb", retained: 89, churned: 11, newCustomers: 12 },
  { month: "Mar", retained: 94, churned: 6, newCustomers: 18 },
  { month: "Apr", retained: 91, churned: 9, newCustomers: 14 },
  { month: "May", retained: 96, churned: 4, newCustomers: 22 },
  { month: "Jun", retained: 93, churned: 7, newCustomers: 19 },
]

const customerJourney = [
  { stage: "Awareness", count: 1000, conversion: 100 },
  { stage: "Interest", count: 400, conversion: 40 },
  { stage: "Consideration", count: 200, conversion: 50 },
  { stage: "Purchase", count: 100, conversion: 80 },
  { stage: "Retention", count: 80, conversion: 93 },
]

export function CustomerIntelligence() {
  const [activeView, setActiveView] = useState<"overview" | "segments" | "journey">("overview")

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Customer Intelligence
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant={activeView === "overview" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveView("overview")}
            >
              Overview
            </Button>
            <Button
              variant={activeView === "segments" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveView("segments")}
            >
              Segments
            </Button>
            <Button
              variant={activeView === "journey" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveView("journey")}
            >
              Journey
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700 dark:text-green-300">Retention Rate</span>
            </div>
            <p className="text-2xl font-bold text-green-800 dark:text-green-200">93%</p>
            <Progress value={93} className="h-2" />
            <p className="text-xs text-green-600 dark:text-green-400">Above industry avg</p>
          </div>
          <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-700 dark:text-yellow-300">Satisfaction</span>
            </div>
            <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">4.7/5</p>
            <Progress value={94} className="h-2" />
            <p className="text-xs text-yellow-600 dark:text-yellow-400">1,247 reviews</p>
          </div>
          <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-700 dark:text-blue-300">NPS Score</span>
            </div>
            <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">+67</p>
            <Progress value={78} className="h-2" />
            <p className="text-xs text-blue-600 dark:text-blue-400">Excellent rating</p>
          </div>
        </div>

        {activeView === "overview" && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Customer Segments
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={customerSegments}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={70}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {customerSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Retention Trend
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={retentionData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Line type="monotone" dataKey="retained" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="newCustomers" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeView === "segments" && (
          <div className="space-y-4">
            <h4 className="font-semibold">Detailed Segment Analysis</h4>
            <div className="grid gap-3">
              {customerSegments.map((segment, index) => (
                <div key={index} className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: segment.color }}></div>
                      <span className="font-medium">{segment.name} Customers</span>
                    </div>
                    <Badge variant="outline">{segment.value}% of base</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Revenue</p>
                      <p className="font-semibold">${segment.revenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg. Order</p>
                      <p className="font-semibold">${(segment.revenue / (segment.value * 5)).toFixed(0)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Lifetime Value</p>
                      <p className="font-semibold">${((segment.revenue / segment.value) * 2).toFixed(0)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === "journey" && (
          <div className="space-y-4">
            <h4 className="font-semibold">Customer Journey Funnel</h4>
            <div className="space-y-3">
              {customerJourney.map((stage, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                  <div className="w-24 text-sm font-medium">{stage.stage}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{stage.count} customers</span>
                      <span className="text-sm text-muted-foreground">{stage.conversion}% conversion</span>
                    </div>
                    <Progress value={stage.conversion} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="font-semibold">Customer Insights & Opportunities</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
              <span className="text-sm font-medium">Top 20% Revenue Share</span>
              <div className="text-right">
                <Badge variant="secondary" className="mb-1">
                  68%
                </Badge>
                <p className="text-xs text-green-600">Strong concentration</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
              <span className="text-sm font-medium">Average Order Value</span>
              <div className="text-right">
                <Badge variant="secondary" className="mb-1">
                  $1,200
                </Badge>
                <p className="text-xs text-blue-600">↑ 18% this quarter</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
              <span className="text-sm font-medium">Upsell Success Rate</span>
              <div className="text-right">
                <Badge variant="secondary" className="mb-1">
                  34%
                </Badge>
                <p className="text-xs text-orange-600">Room for improvement</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
              <span className="text-sm font-medium">Churn Risk Customers</span>
              <div className="text-right">
                <Badge variant="destructive" className="mb-1">
                  12
                </Badge>
                <p className="text-xs text-red-600">Needs attention</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
