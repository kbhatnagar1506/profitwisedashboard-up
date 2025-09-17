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
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts"
import { Users, UserCheck, Star, TrendingUp, Target, Award, Heart, AlertTriangle, Clock, DollarSign, MessageSquare, ShoppingCart, UserPlus, UserMinus } from "lucide-react"

const customerSegments = [
  { 
    name: "Premium", 
    value: 30, 
    color: "#10b981", 
    revenue: 180000, 
    count: 45,
    avgOrderValue: 4000,
    lifetimeValue: 12000,
    churnRate: 2.1,
    satisfaction: 4.8
  },
  { 
    name: "Standard", 
    value: 45, 
    color: "#3b82f6", 
    revenue: 135000, 
    count: 68,
    avgOrderValue: 2000,
    lifetimeValue: 6000,
    churnRate: 4.2,
    satisfaction: 4.5
  },
  { 
    name: "Basic", 
    value: 25, 
    color: "#f59e0b", 
    revenue: 50000, 
    count: 37,
    avgOrderValue: 1350,
    lifetimeValue: 2700,
    churnRate: 8.5,
    satisfaction: 4.2
  },
]

const retentionData = [
  { month: "Jan", retained: 92, churned: 8, newCustomers: 15, reactivated: 3 },
  { month: "Feb", retained: 89, churned: 11, newCustomers: 12, reactivated: 2 },
  { month: "Mar", retained: 94, churned: 6, newCustomers: 18, reactivated: 4 },
  { month: "Apr", retained: 91, churned: 9, newCustomers: 14, reactivated: 1 },
  { month: "May", retained: 96, churned: 4, newCustomers: 22, reactivated: 5 },
  { month: "Jun", retained: 93, churned: 7, newCustomers: 19, reactivated: 3 },
]

const customerJourney = [
  { stage: "Awareness", count: 1000, conversion: 100, avgTime: "2 days" },
  { stage: "Interest", count: 400, conversion: 40, avgTime: "5 days" },
  { stage: "Consideration", count: 200, conversion: 50, avgTime: "12 days" },
  { stage: "Purchase", count: 100, conversion: 80, avgTime: "3 days" },
  { stage: "Retention", count: 80, conversion: 93, avgTime: "30 days" },
]

const behaviorData = [
  { metric: "Page Views", value: 12500, trend: "up", change: "+15%" },
  { metric: "Session Duration", value: 8.5, trend: "up", change: "+12%" },
  { metric: "Bounce Rate", value: 32, trend: "down", change: "-8%" },
  { metric: "Return Visits", value: 68, trend: "up", change: "+5%" },
  { metric: "Mobile Usage", value: 72, trend: "up", change: "+18%" },
]

const customerFeedback = [
  { category: "Product Quality", score: 4.7, responses: 234, trend: "up" },
  { category: "Customer Service", score: 4.5, responses: 189, trend: "stable" },
  { category: "Delivery Speed", score: 4.3, responses: 156, trend: "up" },
  { category: "Value for Money", score: 4.6, responses: 201, trend: "up" },
  { category: "Ease of Use", score: 4.8, responses: 178, trend: "up" },
]

export function CustomerIntelligence() {
  const [activeView, setActiveView] = useState<"overview" | "segments" | "journey" | "behavior" | "feedback">("overview")

  return (
    <div className="space-y-6">
      {/* Main Customer Intelligence Dashboard */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Customer Intelligence Dashboard
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant={activeView === "overview" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("overview")}
              >
                <Target className="w-4 h-4 mr-2" />
                Overview
              </Button>
              <Button
                variant={activeView === "segments" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("segments")}
              >
                <Award className="w-4 h-4 mr-2" />
                Segments
              </Button>
              <Button
                variant={activeView === "journey" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("journey")}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Journey
              </Button>
              <Button
                variant={activeView === "behavior" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("behavior")}
              >
                <Heart className="w-4 h-4 mr-2" />
                Behavior
              </Button>
              <Button
                variant={activeView === "feedback" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("feedback")}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Feedback
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Customer Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
            <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-purple-700 dark:text-purple-300">Avg. LTV</span>
              </div>
              <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">$6,200</p>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-purple-600 dark:text-purple-400">↑ 12% this quarter</p>
            </div>
          </div>

          {/* Dynamic Content Based on Active View */}
          {activeView === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    <AreaChart data={retentionData}>
                      <defs>
                        <linearGradient id="colorRetained" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Area type="monotone" dataKey="retained" stroke="#10b981" fill="url(#colorRetained)" strokeWidth={2} />
                      <Area type="monotone" dataKey="newCustomers" stroke="#3b82f6" fill="url(#colorNew)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeView === "segments" && (
            <div className="space-y-4">
              <h4 className="font-semibold">Detailed Segment Analysis</h4>
              <div className="grid gap-4">
                {customerSegments.map((segment, index) => (
                  <div key={index} className="p-6 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: segment.color }}></div>
                        <span className="font-medium text-lg">{segment.name} Customers</span>
                      </div>
                      <Badge variant="outline" className="text-sm">{segment.value}% of base</Badge>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-muted-foreground">Revenue</p>
                        <p className="font-semibold text-lg">${segment.revenue.toLocaleString()}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-muted-foreground">Avg. Order Value</p>
                        <p className="font-semibold text-lg">${segment.avgOrderValue.toLocaleString()}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-muted-foreground">Lifetime Value</p>
                        <p className="font-semibold text-lg">${segment.lifetimeValue.toLocaleString()}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-muted-foreground">Churn Rate</p>
                        <p className="font-semibold text-lg">{segment.churnRate}%</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">Satisfaction: {segment.satisfaction}/5</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">{segment.count} customers</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === "journey" && (
            <div className="space-y-6">
              <h4 className="font-semibold">Customer Journey Funnel</h4>
              <div className="space-y-4">
                {customerJourney.map((stage, index) => (
                  <div key={index} className="flex items-center gap-6 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="w-32 text-sm font-medium">{stage.stage}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{stage.count} customers</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">{stage.conversion}% conversion</span>
                          <span className="text-xs text-muted-foreground">Avg: {stage.avgTime}</span>
                        </div>
                      </div>
                      <Progress value={stage.conversion} className="h-3" />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Journey Insights</h5>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  The consideration stage shows the highest drop-off rate (50%). Consider implementing targeted retargeting campaigns 
                  and personalized content to improve conversion at this critical stage.
                </p>
              </div>
            </div>
          )}

          {activeView === "behavior" && (
            <div className="space-y-6">
              <h4 className="font-semibold">Customer Behavior Analytics</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium mb-4">Behavior Metrics</h5>
                  <div className="space-y-3">
                    {behaviorData.map((metric, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="text-sm font-medium">{metric.metric}</span>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{metric.value}</span>
                            <Badge variant={metric.trend === "up" ? "default" : "secondary"}>
                              {metric.change}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium mb-4">Behavior Trends</h5>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={behaviorData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="metric" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === "feedback" && (
            <div className="space-y-6">
              <h4 className="font-semibold">Customer Feedback Analysis</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium mb-4">Feedback Scores by Category</h5>
                  <div className="space-y-3">
                    {customerFeedback.map((feedback, index) => (
                      <div key={index} className="p-4 rounded-lg bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{feedback.category}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">{feedback.score}/5</span>
                            <Badge variant="outline">{feedback.responses} responses</Badge>
                          </div>
                        </div>
                        <Progress value={feedback.score * 20} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium mb-4">Recent Customer Comments</h5>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        "Excellent product quality and fast delivery. Highly recommended!"
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">- Sarah M., Premium Customer</p>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        "Great customer service. The team was very helpful with my questions."
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">- John D., Standard Customer</p>
                    </div>
                    <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        "Good value for money, but delivery could be faster."
                      </p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">- Mike R., Basic Customer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Customer Insights & Opportunities */}
          <div className="space-y-3">
            <h4 className="font-semibold">Customer Insights & Opportunities</h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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

      {/* Additional Customer Intelligence Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Customer Alerts & Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 mb-2">
                <UserMinus className="w-4 h-4 text-red-600" />
                <span className="font-medium text-red-800 dark:text-red-200">High Churn Risk</span>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300">
                12 customers show high churn risk. Immediate retention campaigns recommended.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-yellow-800 dark:text-yellow-200">Low Engagement</span>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                8 customers haven't engaged in 30+ days. Consider re-engagement campaigns.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <UserPlus className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-200">Upsell Opportunity</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                25 Standard customers ready for Premium upgrade based on usage patterns.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Customer Health Score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">87/100</div>
              <p className="text-sm text-muted-foreground">Overall Customer Health</p>
              <Progress value={87} className="mt-2" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Satisfaction</span>
                <Badge variant="secondary">Excellent</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Retention</span>
                <Badge variant="secondary">Good</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Engagement</span>
                <Badge variant="secondary">Good</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Growth Potential</span>
                <Badge variant="secondary">Excellent</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
