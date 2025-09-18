"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Brain, 
  RefreshCw, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  Clock,
  Zap,
  Loader2,
  Sparkles
} from "lucide-react"
import { dataService } from "@/lib/data-service"

interface AIInsight {
  title: string
  description: string
  type: 'opportunity' | 'risk' | 'trend' | 'recommendation'
  confidence: number
  action_required: boolean
  category: string
}

interface AIRecommendation {
  title: string
  description: string
  category: string
  priority: 'High' | 'Medium' | 'Low'
  timeline: string
  impact: 'High' | 'Medium' | 'Low'
  effort: 'High' | 'Medium' | 'Low'
  specific_actions: string[]
}

interface AIAnalysis {
  executive_summary?: string
  financial_analysis?: any
  customer_analysis?: any
  growth_analysis?: any
  operational_analysis?: any
  strategic_recommendations?: string[]
  priority_actions?: string[]
  long_term_goals?: string[]
  risk_assessment?: any
  success_metrics?: any
  ai_confidence_score?: number
  analysis_timestamp?: string
}

export function AIAnalysisDisplay() {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null)
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastAnalysis, setLastAnalysis] = useState<string>('')
  const [hasAnalysis, setHasAnalysis] = useState(false)

  useEffect(() => {
    loadAIInsights()
  }, [])

  const loadAIInsights = async () => {
    try {
      const aiData = await dataService.getAIInsights()
      if (aiData) {
        setAnalysis(aiData.analysis || {})
        setInsights(aiData.insights?.insights || [])
        setRecommendations(aiData.recommendations?.recommendations || [])
        setLastAnalysis(aiData.last_analysis || '')
        setHasAnalysis(aiData.has_analysis || false)
      }
    } catch (error) {
      console.error('Error loading AI insights:', error)
    }
  }

  const runAnalysis = async () => {
    setIsLoading(true)
    try {
      const result = await dataService.runAIAnalysis()
      if (result.success) {
        setAnalysis(result.analysis)
        setInsights(result.insights?.insights || [])
        setRecommendations(result.recommendations?.recommendations || [])
        setLastAnalysis(result.timestamp)
        setHasAnalysis(true)
      }
    } catch (error) {
      console.error('Error running AI analysis:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'risk': return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'trend': return <Target className="w-4 h-4 text-blue-500" />
      case 'recommendation': return <CheckCircle className="w-4 h-4 text-purple-500" />
      default: return <Brain className="w-4 h-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Financial': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'Customer': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      case 'Growth': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'Operations': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      case 'Marketing': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  if (!hasAnalysis && !isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI Business Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Run AI Analysis</h3>
              <p className="text-muted-foreground mb-4">
                Get comprehensive AI-powered insights about your business
              </p>
              <Button onClick={runAnalysis} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Run AI Analysis
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh Button */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              AI Business Analysis
            </CardTitle>
            <Button 
              onClick={runAnalysis} 
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Analysis
                </>
              )}
            </Button>
          </div>
          {lastAnalysis && (
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date(lastAnalysis).toLocaleString()}
            </p>
          )}
        </CardHeader>
      </Card>

      {/* Executive Summary */}
      {analysis?.executive_summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {analysis.executive_summary}
            </p>
            {analysis.ai_confidence_score && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">AI Confidence</span>
                  <span className="text-sm text-muted-foreground">
                    {analysis.ai_confidence_score}%
                  </span>
                </div>
                <Progress value={analysis.ai_confidence_score} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* AI Insights */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {insights.map((insight, index) => (
                <div key={index} className="p-4 rounded-lg border bg-card">
                  <div className="flex items-start gap-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{insight.title}</h4>
                        <Badge variant="outline" className={getCategoryColor(insight.category)}>
                          {insight.category}
                        </Badge>
                        {insight.action_required && (
                          <Badge variant="destructive" className="text-xs">
                            Action Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {insight.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          Confidence: {insight.confidence}%
                        </span>
                        <Progress value={insight.confidence} className="h-1 w-20" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="p-4 rounded-lg border bg-card">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold">{rec.title}</h4>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(rec.priority)}>
                        {rec.priority}
                      </Badge>
                      <Badge variant="outline" className={getCategoryColor(rec.category)}>
                        {rec.category}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {rec.description}
                  </p>
                  <div className="grid grid-cols-3 gap-4 mb-3 text-xs">
                    <div>
                      <span className="text-muted-foreground">Timeline:</span>
                      <p className="font-medium">{rec.timeline}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Impact:</span>
                      <p className="font-medium">{rec.impact}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Effort:</span>
                      <p className="font-medium">{rec.effort}</p>
                    </div>
                  </div>
                  {rec.specific_actions && rec.specific_actions.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium mb-2">Specific Actions:</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {rec.specific_actions.map((action, actionIndex) => (
                          <li key={actionIndex} className="flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strategic Recommendations */}
      {analysis?.strategic_recommendations && analysis.strategic_recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              Strategic Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.strategic_recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Priority Actions */}
      {analysis?.priority_actions && analysis.priority_actions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Priority Actions (Next 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.priority_actions.map((action, index) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                  <span className="text-sm">{action}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
