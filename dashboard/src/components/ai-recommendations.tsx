import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lightbulb, TrendingUp, DollarSign, Users, ArrowRight } from "lucide-react"

export function AIRecommendations() {
  const recommendations = [
    {
      type: "Growth",
      priority: "High",
      title: "Increase pricing by 15% for premium customers",
      description:
        "Analysis shows your top 20% customers have low price sensitivity. Potential $3.2K additional monthly revenue.",
      impact: "+$3.2K/mo",
      icon: DollarSign,
      color: "green",
    },
    {
      type: "Efficiency",
      priority: "Medium",
      title: "Automate customer onboarding process",
      description: "Current manual process takes 4 hours per customer. Automation could save 20 hours/week.",
      impact: "20h/week saved",
      icon: Users,
      color: "blue",
    },
    {
      type: "Marketing",
      priority: "High",
      title: "Focus LinkedIn content on case studies",
      description: "Your case study posts have 3x higher engagement. Increase frequency to 2x per week.",
      impact: "+45% engagement",
      icon: TrendingUp,
      color: "purple",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          AI Recommendations
          <Badge variant="secondary" className="ml-2">
            3 Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec, index) => (
          <div key={index} className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg bg-${rec.color}-500/10`}>
                  <rec.icon className={`w-4 h-4 text-${rec.color}-400`} />
                </div>
                <Badge variant={rec.priority === "High" ? "destructive" : "secondary"} className="text-xs">
                  {rec.priority}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {rec.type}
                </Badge>
              </div>
              <Button size="sm" variant="ghost" className="h-8 px-2">
                <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
            <h4 className="font-semibold mb-1">{rec.title}</h4>
            <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium text-${rec.color}-400`}>Potential Impact: {rec.impact}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
