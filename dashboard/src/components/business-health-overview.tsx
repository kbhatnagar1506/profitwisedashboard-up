import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, Users, AlertTriangle } from "lucide-react"

interface BusinessData {
  business_name?: string
  category?: string
  website_url?: string
  created_at?: string
}

interface BusinessHealthOverviewProps {
  businessData?: BusinessData
}

export function BusinessHealthOverview({ businessData }: BusinessHealthOverviewProps) {
  return (
    <Card className="border-2 border-green-500/20 bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            Business Health: 85%
          </CardTitle>
          <Badge variant="secondary" className="bg-green-500/10 text-foreground border-green-500/20">
            Healthy
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Progress value={85} className="h-3" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
            <div className="p-2 rounded-lg bg-green-500/10">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="text-lg font-semibold">$45K/mo</p>
              <p className="text-xs text-green-400">+12% vs last month</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Profit</p>
              <p className="text-lg font-semibold">$12K/mo</p>
              <p className="text-xs text-blue-400">26.7% margin</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Customers</p>
              <p className="text-lg font-semibold">150</p>
              <p className="text-xs text-purple-400">+8 this month</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800">
          <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          <p className="text-sm text-slate-900 dark:text-slate-100">
            1 Alert: Cash flow projection shows potential shortage in Q3
          </p>
        </div>

        {businessData && (
          <div className="mt-6 p-4 rounded-lg bg-muted/50">
            <h3 className="font-semibold mb-3">Your Business Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Business Name:</span>
                <p className="font-medium">{businessData.business_name || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Category:</span>
                <p className="font-medium">{businessData.category || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Website:</span>
                <p className="font-medium">{businessData.website_url || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Setup Date:</span>
                <p className="font-medium">
                  {businessData.created_at ? new Date(businessData.created_at).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
