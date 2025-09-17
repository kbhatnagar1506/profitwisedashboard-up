import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { Share2, Heart, MessageCircle, Eye } from "lucide-react"

const socialData = [
  { platform: "LinkedIn", followers: 2400, engagement: 4.2, posts: 12 },
  { platform: "Twitter", followers: 1800, engagement: 2.8, posts: 24 },
  { platform: "Instagram", followers: 3200, engagement: 6.1, posts: 16 },
]

export function SocialMediaAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Social Media Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-muted-foreground">Total Reach</span>
            </div>
            <p className="text-2xl font-bold">47.2K</p>
            <Progress value={78} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-sm text-muted-foreground">Avg Engagement</span>
            </div>
            <p className="text-2xl font-bold">4.4%</p>
            <Progress value={88} className="h-2" />
          </div>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={socialData}>
              <XAxis dataKey="platform" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="engagement" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">Platform Performance</h4>
          {socialData.map((platform, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">{platform.platform}</p>
                <p className="text-sm text-muted-foreground">{platform.followers.toLocaleString()} followers</p>
              </div>
              <div className="text-right">
                <Badge variant="secondary">{platform.engagement}% engagement</Badge>
                <p className="text-xs text-muted-foreground mt-1">{platform.posts} posts this month</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-4 h-4 text-blue-400" />
            <p className="text-sm font-medium text-blue-400">Content Recommendation</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Your case study posts perform 3x better. Consider increasing frequency to 2x per week.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
