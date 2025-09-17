"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  DollarSign,
  Users,
  Target,
  BarChart3,
  PieChart
} from "lucide-react"

const healthMetrics = [
  {
    title: "Overall Health Score",
    value: 85,
    max: 100,
    trend: "up",
    change: "+5%",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20"
  },
  {
    title: "Financial Health",
    value: 88,
    max: 100,
    trend: "up",
    change: "+3%",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20"
  },
  {
    title: "Customer Health",
    value: 92,
    max: 100,
    trend: "up",
    change: "+7%",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20"
  },
  {
    title: "Operational Health",
    value: 78,
    max: 100,
    trend: "down",
    change: "-2%",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20"
  }
]

const riskFactors = [
  {
    title: "Cash Flow Risk",
    severity: "high",
    description: "Q3 projection shows potential shortage",
    impact: "High",
    recommendation: "Review expense management and consider revenue diversification"
  },
  {
    title: "Customer Concentration",
    severity: "medium",
    description: "Top 3 customers represent 45% of revenue",
    impact: "Medium",
    recommendation: "Diversify customer base and implement retention strategies"
  },
  {
    title: "Market Competition",
    severity: "low",
    description: "New competitors entering the market",
    impact: "Low",
    recommendation: "Monitor competitive landscape and strengthen value proposition"
  }
]

const improvementAreas = [
  {
    area: "Revenue Growth",
    current: 12.5,
    target: 20,
    progress: 62.5,
    priority: "high"
  },
  {
    area: "Customer Retention",
    current: 94.2,
    target: 96,
    progress: 98.1,
    priority: "medium"
  },
  {
    area: "Profit Margin",
    current: 26.7,
    target: 30,
    progress: 89,
    priority: "high"
  },
  {
    area: "Operational Efficiency",
    current: 78,
    target: 85,
    progress: 91.8,
    priority: "medium"
  }
]

export function BusinessHealthDetailed() {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-500 bg-red-500/10 border-red-500/20'
      case 'medium':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
      case 'low':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500/20'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500'
      case 'medium':
        return 'text-yellow-500'
      case 'low':
        return 'text-green-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Health Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {healthMetrics.map((metric, index) => (
          <Card key={index} className={`${metric.bgColor} ${metric.borderColor} border-2`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-3xl font-bold ${metric.color}`}>
                  {metric.value}%
                </span>
                <div className="flex items-center gap-1">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${metric.color}`}>
                    {metric.change}
                  </span>
                </div>
              </div>
              <Progress value={metric.value} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskFactors.map((risk, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getSeverityColor(risk.severity)}`}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{risk.title}</h3>
                  <Badge variant="outline" className={getSeverityColor(risk.severity)}>
                    {risk.severity.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{risk.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span><strong>Impact:</strong> {risk.impact}</span>
                  <span className="text-muted-foreground">{risk.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Improvement Areas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Improvement Areas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {improvementAreas.map((area, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{area.area}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {area.current}% / {area.target}%
                    </span>
                    <Badge 
                      variant="outline" 
                      className={getPriorityColor(area.priority)}
                    >
                      {area.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <Progress value={area.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress: {area.progress.toFixed(1)}%</span>
                    <span>Remaining: {((area.target - area.current) / area.target * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Health Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              Health Trends (6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Overall Health</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full">
                    <div className="w-4/5 h-full bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">85%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Financial Health</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full">
                    <div className="w-4/5 h-full bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">88%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Customer Health</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full">
                    <div className="w-5/6 h-full bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">92%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Operational Health</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full">
                    <div className="w-3/4 h-full bg-yellow-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">78%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-orange-500" />
              Health Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Excellent (80-100%)</span>
                </div>
                <span className="text-sm font-medium">65%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Good (60-79%)</span>
                </div>
                <span className="text-sm font-medium">25%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Needs Attention (&lt;60%)</span>
                </div>
                <span className="text-sm font-medium">10%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Recommended Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium">Immediate Actions</h4>
                <p className="text-sm text-muted-foreground">Review Q3 cash flow projections and implement cost optimization measures</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium">Short-term Goals</h4>
                <p className="text-sm text-muted-foreground">Diversify customer base and improve operational efficiency metrics</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium">Long-term Strategy</h4>
                <p className="text-sm text-muted-foreground">Maintain customer retention excellence and expand market presence</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
