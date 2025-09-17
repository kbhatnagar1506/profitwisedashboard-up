import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Target, Zap, ArrowRight } from "lucide-react"

export function GrowthOpportunities() {
  const opportunities = [
    {
      title: "Market Expansion",
      description: "Enter the European market with localized pricing",
      potential: "$15K/mo",
      effort: "High",
      timeline: "6 months",
      confidence: 78,
    },
    {
      title: "Product Upselling",
      description: "Introduce premium tier with advanced features",
      potential: "$8K/mo",
      effort: "Medium",
      timeline: "3 months",
      confidence: 92,
    },
    {
      title: "Partnership Channel",
      description: "Partner with complementary service providers",
      potential: "$12K/mo",
      effort: "Medium",
      timeline: "4 months",
      confidence: 65,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Growth Opportunities
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {opportunities.map((opp, index) => (
          <div key={index} className="p-4 rounded-lg border bg-muted/30">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-400" />
                <h4 className="font-semibold">{opp.title}</h4>
              </div>
              <Badge variant={opp.effort === "High" ? "destructive" : "secondary"}>{opp.effort} Effort</Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-3">{opp.description}</p>

            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Potential</p>
                <p className="font-semibold text-green-400">{opp.potential}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Timeline</p>
                <p className="font-semibold">{opp.timeline}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Confidence</p>
                <p className="font-semibold text-blue-400">{opp.confidence}%</p>
              </div>
            </div>

            <Button size="sm" variant="outline" className="w-full bg-transparent">
              <Zap className="w-3 h-3 mr-2" />
              Explore Opportunity
              <ArrowRight className="w-3 h-3 ml-2" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
