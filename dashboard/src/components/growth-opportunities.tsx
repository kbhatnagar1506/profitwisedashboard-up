"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  Target, 
  Zap, 
  ArrowRight, 
  Globe, 
  DollarSign, 
  Calendar, 
  BarChart3, 
  PieChart, 
  MapPin, 
  Users, 
  Lightbulb, 
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  TrendingDown,
  Activity
} from "lucide-react"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell 
} from "recharts"

const marketData = [
  { region: "North America", current: 45, potential: 65, growth: 12, competition: "Medium" },
  { region: "Europe", current: 15, potential: 40, growth: 18, competition: "Low" },
  { region: "Asia Pacific", current: 8, potential: 35, growth: 25, competition: "High" },
  { region: "Latin America", current: 5, potential: 20, growth: 15, competition: "Medium" },
  { region: "Middle East", current: 2, potential: 15, growth: 20, competition: "Low" },
]

const roiProjections = [
  { month: "Jan", investment: 5000, revenue: 0, cumulative: -5000 },
  { month: "Feb", investment: 3000, revenue: 2000, cumulative: -6000 },
  { month: "Mar", investment: 2000, revenue: 5000, cumulative: -3000 },
  { month: "Apr", investment: 1500, revenue: 8000, cumulative: 3500 },
  { month: "May", investment: 1000, revenue: 12000, cumulative: 14500 },
  { month: "Jun", investment: 1000, revenue: 15000, cumulative: 28500 },
  { month: "Jul", investment: 1000, revenue: 18000, cumulative: 45500 },
  { month: "Aug", investment: 1000, revenue: 22000, cumulative: 66500 },
]

const opportunityCategories = [
  { name: "Market Expansion", value: 35, color: "#10b981", revenue: 150000 },
  { name: "Product Development", value: 25, color: "#3b82f6", revenue: 120000 },
  { name: "Partnerships", value: 20, color: "#f59e0b", revenue: 80000 },
  { name: "Digital Marketing", value: 15, color: "#8b5cf6", revenue: 60000 },
  { name: "Operational Efficiency", value: 5, color: "#ef4444", revenue: 30000 },
]

const growthMetrics = {
  marketSize: 2500000000,
  marketShare: 0.02,
  growthRate: 0.15,
  customerAcquisitionCost: 180,
  customerLifetimeValue: 6200,
  churnRate: 0.07,
  netPromoterScore: 67
}

export function GrowthOpportunities() {
  const [activeView, setActiveView] = useState<"overview" | "markets" | "roi" | "strategies">("overview")
  
  const opportunities = [
    {
      id: 1,
      title: "European Market Expansion",
      description: "Enter the European market with localized pricing and compliance",
      category: "Market Expansion",
      potential: "$25K/mo",
      investment: "$50K",
      effort: "High",
      timeline: "6 months",
      confidence: 78,
      roi: 180,
      risk: "Medium",
      status: "Planning",
      marketSize: "$2.5B",
      competition: "Medium",
      keyFactors: ["GDPR Compliance", "Local Partnerships", "Currency Exchange"],
      milestones: [
        { phase: "Research & Planning", completed: true, progress: 100 },
        { phase: "Legal & Compliance", completed: false, progress: 60 },
        { phase: "Partnership Development", completed: false, progress: 20 },
        { phase: "Market Entry", completed: false, progress: 0 }
      ]
    },
    {
      id: 2,
      title: "AI-Powered Premium Tier",
      description: "Introduce AI-powered features for premium customers",
      category: "Product Development",
      potential: "$18K/mo",
      investment: "$30K",
      effort: "Medium",
      timeline: "4 months",
      confidence: 92,
      roi: 240,
      risk: "Low",
      status: "In Progress",
      marketSize: "$1.8B",
      competition: "High",
      keyFactors: ["AI Integration", "User Experience", "Pricing Strategy"],
      milestones: [
        { phase: "Feature Development", completed: true, progress: 100 },
        { phase: "Beta Testing", completed: true, progress: 100 },
        { phase: "AI Integration", completed: false, progress: 75 },
        { phase: "Launch", completed: false, progress: 30 }
      ]
    },
    {
      id: 3,
      title: "Strategic Partnerships",
      description: "Partner with complementary service providers for cross-selling",
      category: "Partnerships",
      potential: "$15K/mo",
      investment: "$20K",
      effort: "Medium",
      timeline: "3 months",
      confidence: 85,
      roi: 200,
      risk: "Low",
      status: "Planning",
      marketSize: "$1.2B",
      competition: "Low",
      keyFactors: ["Partner Selection", "Integration", "Revenue Sharing"],
      milestones: [
        { phase: "Partner Research", completed: true, progress: 100 },
        { phase: "Negotiations", completed: false, progress: 40 },
        { phase: "Integration", completed: false, progress: 10 },
        { phase: "Launch", completed: false, progress: 0 }
      ]
    },
    {
      id: 4,
      title: "Digital Marketing Expansion",
      description: "Scale digital marketing across multiple channels",
      category: "Digital Marketing",
      potential: "$12K/mo",
      investment: "$15K",
      effort: "Low",
      timeline: "2 months",
      confidence: 88,
      roi: 160,
      risk: "Low",
      status: "Planning",
      marketSize: "$800M",
      competition: "High",
      keyFactors: ["Channel Mix", "Content Strategy", "Budget Allocation"],
      milestones: [
        { phase: "Strategy Development", completed: true, progress: 100 },
        { phase: "Campaign Setup", completed: false, progress: 50 },
        { phase: "Launch", completed: false, progress: 0 },
        { phase: "Optimization", completed: false, progress: 0 }
      ]
    }
  ]

  return (
    <div className="space-y-6">
      {/* Main Growth Opportunities Dashboard */}
    <Card>
      <CardHeader>
          <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
              Growth Opportunities Dashboard
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
                variant={activeView === "markets" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("markets")}
              >
                <Globe className="w-4 h-4 mr-2" />
                Markets
              </Button>
              <Button
                variant={activeView === "roi" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("roi")}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                ROI Analysis
              </Button>
              <Button
                variant={activeView === "strategies" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("strategies")}
              >
                <Target className="w-4 h-4 mr-2" />
                Strategies
              </Button>
            </div>
          </div>
      </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Growth Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700 dark:text-green-300">Market Size</span>
              </div>
              <p className="text-2xl font-bold text-green-800 dark:text-green-200">$2.5B</p>
              <Progress value={75} className="h-2" />
              <p className="text-xs text-green-600 dark:text-green-400">Total addressable market</p>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700 dark:text-blue-300">Market Share</span>
              </div>
              <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">2%</p>
              <Progress value={20} className="h-2" />
              <p className="text-xs text-blue-600 dark:text-blue-400">Current market share</p>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-purple-700 dark:text-purple-300">Growth Rate</span>
              </div>
              <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">15%</p>
              <Progress value={75} className="h-2" />
              <p className="text-xs text-purple-600 dark:text-purple-400">Annual growth rate</p>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-orange-700 dark:text-orange-300">NPS Score</span>
              </div>
              <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">+67</p>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-orange-600 dark:text-orange-400">Customer satisfaction</p>
            </div>
          </div>

          {/* Dynamic Content Based on Active View */}
          {activeView === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <PieChart className="w-4 h-4" />
                  Opportunity Categories
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={opportunityCategories}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {opportunityCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Top Growth Opportunities
                </h4>
                <div className="space-y-3">
                  {opportunities.slice(0, 3).map((opp) => (
                    <div key={opp.id} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{opp.title}</span>
                        <Badge variant={opp.status === "In Progress" ? "default" : "secondary"}>
                          {opp.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Potential: {opp.potential}</span>
                        <span>ROI: {opp.roi}%</span>
                        <span>Confidence: {opp.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeView === "markets" && (
            <div className="space-y-6">
              <h4 className="font-semibold">Global Market Analysis</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={marketData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="region" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="current" fill="#3b82f6" name="Current Market Share" />
                    <Bar dataKey="potential" fill="#10b981" name="Potential Market Share" />
                  </BarChart>
                </ResponsiveContainer>
            </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-3">Market Opportunity by Region</h5>
                  <div className="space-y-2">
                    {marketData.map((market, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{market.region}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">{market.growth}% growth</div>
                          <div className="text-xs text-muted-foreground">{market.competition} competition</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium mb-3">Market Insights</h5>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-800 dark:text-green-200">High Potential</span>
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Asia Pacific shows 25% growth with high competition but significant opportunity.
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-1">
                        <Lightbulb className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-800 dark:text-blue-200">Strategic Focus</span>
                      </div>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Europe offers low competition and 18% growth - ideal for expansion.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === "roi" && (
            <div className="space-y-6">
              <h4 className="font-semibold">ROI Projections & Analysis</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={roiProjections}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Line type="monotone" dataKey="cumulative" stroke="#10b981" strokeWidth={3} />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="investment" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/30">
                  <h5 className="font-medium mb-2">Break-even Point</h5>
                  <p className="text-2xl font-bold text-green-600">4 months</p>
                  <p className="text-xs text-muted-foreground">Projected break-even timeline</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <h5 className="font-medium mb-2">12-Month ROI</h5>
                  <p className="text-2xl font-bold text-blue-600">240%</p>
                  <p className="text-xs text-muted-foreground">Expected return on investment</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <h5 className="font-medium mb-2">Total Investment</h5>
                  <p className="text-2xl font-bold text-purple-600">$50K</p>
                  <p className="text-xs text-muted-foreground">Required upfront investment</p>
                </div>
              </div>
            </div>
          )}

          {activeView === "strategies" && (
            <div className="space-y-6">
              <h4 className="font-semibold">Growth Strategies & Implementation</h4>
              <div className="grid gap-4">
                {opportunities.map((opp) => (
                  <div key={opp.id} className="p-6 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Target className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{opp.title}</h4>
                          <p className="text-sm text-muted-foreground">{opp.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={opp.status === "In Progress" ? "default" : "secondary"}>
                          {opp.status}
                        </Badge>
                        <Badge variant={opp.risk === "Low" ? "default" : "destructive"}>
                          {opp.risk} Risk
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground">Potential Revenue</p>
                        <p className="font-semibold text-green-600">{opp.potential}</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground">Investment Required</p>
                        <p className="font-semibold text-blue-600">{opp.investment}</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground">Expected ROI</p>
                        <p className="font-semibold text-purple-600">{opp.roi}%</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground">Confidence</p>
                        <p className="font-semibold text-orange-600">{opp.confidence}%</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="font-medium mb-2">Implementation Milestones</h5>
                      <div className="space-y-2">
                        {opp.milestones.map((milestone, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              {milestone.completed ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Clock className="w-4 h-4 text-muted-foreground" />
                              )}
                              <span className="text-sm font-medium">{milestone.phase}</span>
                            </div>
                            <div className="flex-1">
                              <Progress value={milestone.progress} className="h-2" />
                            </div>
                            <span className="text-xs text-muted-foreground">{milestone.progress}%</span>
                          </div>
                        ))}
              </div>
            </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {opp.keyFactors.map((factor, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                      <Button size="sm" variant="outline">
              <Zap className="w-3 h-3 mr-2" />
                        View Details
              <ArrowRight className="w-3 h-3 ml-2" />
            </Button>
                    </div>
          </div>
        ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Growth Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Growth Alerts & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-200">High Priority</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                AI-Powered Premium Tier shows 92% confidence with 240% ROI. Recommended for immediate implementation.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-yellow-800 dark:text-yellow-200">Market Timing</span>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                European market expansion timing is optimal. Competition is low and growth rate is 18%.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800 dark:text-blue-200">Strategic Focus</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Focus on partnerships and digital marketing for quick wins while developing long-term market expansion.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Growth Health Score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">82/100</div>
              <p className="text-sm text-muted-foreground">Overall Growth Potential</p>
              <Progress value={82} className="mt-2" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Market Opportunity</span>
                <Badge variant="secondary">Excellent</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Implementation Readiness</span>
                <Badge variant="secondary">Good</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Resource Availability</span>
                <Badge variant="secondary">Good</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Risk Management</span>
                <Badge variant="secondary">Excellent</Badge>
              </div>
            </div>
      </CardContent>
    </Card>
      </div>
    </div>
  )
}
