"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from "recharts"
import { 
  Share2, 
  Heart, 
  MessageCircle, 
  Eye, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  BarChart3, 
  PieChart as PieChartIcon,
  Target,
  Activity,
  Clock,
  Star,
  ThumbsUp,
  Share,
  Bookmark,
  AlertCircle,
  CheckCircle,
  Zap,
  Globe,
  Smartphone,
  Monitor
} from "lucide-react"

const socialData = [
  { 
    platform: "LinkedIn", 
    followers: 2400, 
    engagement: 4.2, 
    posts: 12, 
    reach: 18500, 
    impressions: 32000, 
    clicks: 450, 
    shares: 120,
    comments: 85,
    likes: 380,
    growth: 8.5,
    bestTime: "9-10 AM",
    audienceAge: "25-34",
    audienceGender: "60% Male, 40% Female"
  },
  { 
    platform: "Twitter", 
    followers: 1800, 
    engagement: 2.8, 
    posts: 24, 
    reach: 12000, 
    impressions: 25000, 
    clicks: 320, 
    shares: 95,
    comments: 45,
    likes: 280,
    growth: 12.3,
    bestTime: "2-3 PM",
    audienceAge: "18-29",
    audienceGender: "55% Male, 45% Female"
  },
  { 
    platform: "Instagram", 
    followers: 3200, 
    engagement: 6.1, 
    posts: 16, 
    reach: 28000, 
    impressions: 45000, 
    clicks: 680, 
    shares: 180,
    comments: 120,
    likes: 520,
    growth: 15.7,
    bestTime: "7-8 PM",
    audienceAge: "18-34",
    audienceGender: "45% Male, 55% Female"
  },
  { 
    platform: "Facebook", 
    followers: 1500, 
    engagement: 3.5, 
    posts: 8, 
    reach: 8500, 
    impressions: 18000, 
    clicks: 180, 
    shares: 45,
    comments: 25,
    likes: 150,
    growth: 5.2,
    bestTime: "1-2 PM",
    audienceAge: "35-54",
    audienceGender: "50% Male, 50% Female"
  }
]

const engagementTrends = [
  { month: "Jan", likes: 1200, comments: 180, shares: 95, reach: 45000 },
  { month: "Feb", likes: 1350, comments: 220, shares: 120, reach: 52000 },
  { month: "Mar", likes: 1500, comments: 280, shares: 150, reach: 58000 },
  { month: "Apr", likes: 1680, comments: 320, shares: 180, reach: 62000 },
  { month: "May", likes: 1850, comments: 380, shares: 210, reach: 68000 },
  { month: "Jun", likes: 2100, comments: 450, shares: 250, reach: 75000 },
]

const contentPerformance = [
  { type: "Case Studies", posts: 8, engagement: 8.2, reach: 25000, clicks: 450 },
  { type: "Industry News", posts: 12, engagement: 4.5, reach: 18000, clicks: 280 },
  { type: "Product Updates", posts: 6, engagement: 6.8, reach: 22000, clicks: 320 },
  { type: "Behind the Scenes", posts: 10, engagement: 7.1, reach: 20000, clicks: 380 },
  { type: "User Generated", posts: 4, engagement: 9.5, reach: 30000, clicks: 520 },
]

const audienceDemographics = [
  { age: "18-24", percentage: 25, color: "#3b82f6" },
  { age: "25-34", percentage: 35, color: "#10b981" },
  { age: "35-44", percentage: 25, color: "#f59e0b" },
  { age: "45-54", percentage: 15, color: "#ef4444" },
]

const deviceBreakdown = [
  { device: "Mobile", percentage: 72, color: "#3b82f6" },
  { device: "Desktop", percentage: 23, color: "#10b981" },
  { device: "Tablet", percentage: 5, color: "#f59e0b" },
]

const topPosts = [
  {
    title: "How AI is Transforming Business Analytics",
    platform: "LinkedIn",
    engagement: 8.5,
    reach: 12500,
    likes: 180,
    comments: 25,
    shares: 45,
    type: "Case Study"
  },
  {
    title: "Behind the Scenes: Our Product Development Process",
    platform: "Instagram",
    engagement: 7.8,
    reach: 9800,
    likes: 220,
    comments: 18,
    shares: 32,
    type: "Behind the Scenes"
  },
  {
    title: "Industry Trends: The Future of Data Analytics",
    platform: "Twitter",
    engagement: 6.2,
    reach: 7500,
    likes: 95,
    comments: 12,
    shares: 28,
    type: "Industry News"
  }
]

const socialMetrics = {
  totalReach: 75000,
  totalImpressions: 150000,
  totalEngagement: 4.8,
  totalFollowers: 8900,
  engagementRate: 4.8,
  clickThroughRate: 2.1,
  shareRate: 1.2,
  commentRate: 0.8,
  growthRate: 12.5,
  bestPerformingPlatform: "Instagram",
  optimalPostingTime: "7-8 PM",
  averageReach: 18750
}

export function SocialMediaAnalytics() {
  const [activeView, setActiveView] = useState<"overview" | "engagement" | "content" | "audience">("overview")

  return (
    <div className="space-y-6">
      {/* Main Social Media Analytics Dashboard */}
    <Card>
      <CardHeader>
          <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Share2 className="w-5 h-5" />
              Social Media Analytics Dashboard
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
                variant={activeView === "engagement" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("engagement")}
              >
                <Heart className="w-4 h-4 mr-2" />
                Engagement
              </Button>
              <Button
                variant={activeView === "content" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("content")}
              >
                <Target className="w-4 h-4 mr-2" />
                Content
              </Button>
              <Button
                variant={activeView === "audience" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("audience")}
              >
                <Users className="w-4 h-4 mr-2" />
                Audience
              </Button>
            </div>
          </div>
      </CardHeader>
      <CardContent className="space-y-6">
          {/* Key Social Media Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700 dark:text-blue-300">Total Reach</span>
              </div>
              <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">75K</p>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-blue-600 dark:text-blue-400">+12.5% this month</p>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
            <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-700 dark:text-red-300">Engagement Rate</span>
              </div>
              <p className="text-2xl font-bold text-red-800 dark:text-red-200">4.8%</p>
              <Progress value={80} className="h-2" />
              <p className="text-xs text-red-600 dark:text-red-400">Above industry avg</p>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700 dark:text-green-300">Total Followers</span>
              </div>
              <p className="text-2xl font-bold text-green-800 dark:text-green-200">8.9K</p>
              <Progress value={75} className="h-2" />
              <p className="text-xs text-green-600 dark:text-green-400">+15.7% growth</p>
          </div>
            <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-purple-700 dark:text-purple-300">Click Rate</span>
            </div>
              <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">2.1%</p>
              <Progress value={70} className="h-2" />
              <p className="text-xs text-purple-600 dark:text-purple-400">CTR performance</p>
          </div>
        </div>

          {/* Dynamic Content Based on Active View */}
          {activeView === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Platform Performance
                </h4>
                <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={socialData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="platform" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
                      <Bar dataKey="engagement" fill="#3b82f6" name="Engagement %" />
                      <Bar dataKey="growth" fill="#10b981" name="Growth %" />
            </BarChart>
          </ResponsiveContainer>
                </div>
        </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4" />
                  Audience Demographics
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={audienceDemographics}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="percentage"
                        label={({ age, percentage }) => `${age}: ${percentage}%`}
                      >
                        {audienceDemographics.map((entry, index) => (
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

          {activeView === "engagement" && (
            <div className="space-y-6">
              <h4 className="font-semibold">Engagement Trends & Analysis</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={engagementTrends}>
                    <defs>
                      <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorShares" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
                    <Area type="monotone" dataKey="likes" stroke="#ef4444" fill="url(#colorLikes)" strokeWidth={2} />
                    <Area type="monotone" dataKey="comments" stroke="#3b82f6" fill="url(#colorComments)" strokeWidth={2} />
                    <Area type="monotone" dataKey="shares" stroke="#10b981" fill="url(#colorShares)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/30">
                  <h5 className="font-medium mb-2">Total Likes</h5>
                  <p className="text-2xl font-bold text-red-600">2,100</p>
                  <p className="text-xs text-muted-foreground">+75% this month</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <h5 className="font-medium mb-2">Total Comments</h5>
                  <p className="text-2xl font-bold text-blue-600">450</p>
                  <p className="text-xs text-muted-foreground">+150% this month</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <h5 className="font-medium mb-2">Total Shares</h5>
                  <p className="text-2xl font-bold text-green-600">250</p>
                  <p className="text-xs text-muted-foreground">+163% this month</p>
                </div>
              </div>
            </div>
          )}

          {activeView === "content" && (
            <div className="space-y-6">
              <h4 className="font-semibold">Content Performance Analysis</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium mb-4">Content Type Performance</h5>
                  <div className="space-y-3">
                    {contentPerformance.map((content, index) => (
                      <div key={index} className="p-4 rounded-lg bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{content.type}</span>
                          <Badge variant="secondary">{content.engagement}% engagement</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Posts</p>
                            <p className="font-semibold">{content.posts}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Reach</p>
                            <p className="font-semibold">{content.reach.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Clicks</p>
                            <p className="font-semibold">{content.clicks}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium mb-4">Top Performing Posts</h5>
                  <div className="space-y-3">
                    {topPosts.map((post, index) => (
                      <div key={index} className="p-4 rounded-lg bg-muted/30">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h6 className="font-medium text-sm">{post.title}</h6>
                            <p className="text-xs text-muted-foreground">{post.platform} • {post.type}</p>
                          </div>
                          <Badge variant="outline">{post.engagement}%</Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          <div className="text-center">
                            <p className="text-muted-foreground">Reach</p>
                            <p className="font-semibold">{post.reach.toLocaleString()}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground">Likes</p>
                            <p className="font-semibold">{post.likes}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground">Comments</p>
                            <p className="font-semibold">{post.comments}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground">Shares</p>
                            <p className="font-semibold">{post.shares}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === "audience" && (
            <div className="space-y-6">
              <h4 className="font-semibold">Audience Insights & Demographics</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium mb-4">Age Distribution</h5>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={audienceDemographics}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          dataKey="percentage"
                          label={({ age, percentage }) => `${age}: ${percentage}%`}
                        >
                          {audienceDemographics.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium mb-4">Device Usage</h5>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          dataKey="percentage"
                          label={({ device, percentage }) => `${device}: ${percentage}%`}
                        >
                          {deviceBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium mb-4">Platform Audience Details</h5>
                  <div className="space-y-3">
                    {socialData.map((platform, index) => (
                      <div key={index} className="p-4 rounded-lg bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{platform.platform}</span>
                          <Badge variant="secondary">{platform.followers.toLocaleString()} followers</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Best Time</p>
                            <p className="font-semibold">{platform.bestTime}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Top Age Group</p>
                            <p className="font-semibold">{platform.audienceAge}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">{platform.audienceGender}</p>
              </div>
            </div>
          ))}
                  </div>
        </div>

                <div>
                  <h5 className="font-medium mb-4">Audience Growth</h5>
                  <div className="space-y-3">
                    {socialData.map((platform, index) => (
                      <div key={index} className="p-4 rounded-lg bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{platform.platform}</span>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="text-green-600 font-semibold">+{platform.growth}%</span>
                          </div>
                        </div>
                        <Progress value={platform.growth} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">Monthly growth rate</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Social Media Alerts */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">Content Performance Alert</p>
                <p className="text-xs text-green-700 dark:text-green-300">
                  Case study posts perform 3x better than average. Consider increasing frequency to 2x per week.
                </p>
              </div>
        </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Best Platform</p>
                <p className="text-lg font-semibold">{socialMetrics.bestPerformingPlatform}</p>
                <Badge variant="secondary" className="mt-1">
                  {socialMetrics.engagementRate}% engagement
                </Badge>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Optimal Time</p>
                <p className="text-lg font-semibold">{socialMetrics.optimalPostingTime}</p>
                <Badge variant="secondary" className="mt-1">
                  Peak engagement
                </Badge>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Click Rate</p>
                <p className="text-lg font-semibold">{socialMetrics.clickThroughRate}%</p>
                <Badge variant="secondary" className="mt-1">
                  Above average
                </Badge>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Growth Rate</p>
                <p className="text-lg font-semibold">+{socialMetrics.growthRate}%</p>
                <Badge variant="secondary" className="mt-1">
                  Monthly growth
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Social Media Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Social Media Alerts & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-200">High Performance</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Instagram posts are performing exceptionally well with 6.1% engagement rate. Consider increasing content frequency.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-yellow-800 dark:text-yellow-200">Timing Optimization</span>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Posting at 7-8 PM shows highest engagement. Schedule more content during this time window.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800 dark:text-blue-200">Content Strategy</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                User-generated content performs best. Encourage more customer testimonials and case studies.
          </p>
        </div>
      </CardContent>
    </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Social Media Health Score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">84/100</div>
              <p className="text-sm text-muted-foreground">Overall Social Media Health</p>
              <Progress value={84} className="mt-2" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Engagement Rate</span>
                <Badge variant="secondary">Excellent</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Content Quality</span>
                <Badge variant="secondary">Good</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Audience Growth</span>
                <Badge variant="secondary">Excellent</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Platform Diversity</span>
                <Badge variant="secondary">Good</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
