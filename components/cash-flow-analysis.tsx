import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { Wallet, AlertTriangle, TrendingUp } from "lucide-react"

const cashFlowData = [
  { month: "Jan", inflow: 45000, outflow: 38000, net: 7000 },
  { month: "Feb", inflow: 42000, outflow: 36000, net: 6000 },
  { month: "Mar", inflow: 48000, outflow: 40000, net: 8000 },
  { month: "Apr", inflow: 52000, outflow: 42000, net: 10000 },
  { month: "May", inflow: 49000, outflow: 44000, net: 5000 },
  { month: "Jun", inflow: 45000, outflow: 41000, net: 4000 },
  { month: "Jul", inflow: 47000, outflow: 43000, net: 4000 },
  { month: "Aug", inflow: 44000, outflow: 45000, net: -1000 },
]

export function CashFlowAnalysis() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Cash Flow Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-green-500/10">
            <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <p className="text-sm text-muted-foreground">Avg Monthly Inflow</p>
            <p className="text-lg font-bold text-green-400">$47K</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-red-500/10">
            <TrendingUp className="w-5 h-5 text-red-400 mx-auto mb-1 rotate-180" />
            <p className="text-sm text-muted-foreground">Avg Monthly Outflow</p>
            <p className="text-lg font-bold text-red-400">$41K</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-blue-500/10">
            <Wallet className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <p className="text-sm text-muted-foreground">Net Cash Flow</p>
            <p className="text-lg font-bold text-blue-400">$6K</p>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cashFlowData}>
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
              <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="2 2" />
              <Line type="monotone" dataKey="inflow" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="outflow" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="net" stroke="#3b82f6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <AlertTriangle className="w-4 h-4 text-yellow-700 dark:text-yellow-300" />
            <div>
              <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Cash Flow Warning</p>
              <p className="text-xs text-muted-foreground">
                Projected negative cash flow in August. Consider accelerating receivables.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Days Sales Outstanding</p>
              <p className="text-lg font-semibold">32 days</p>
              <Badge variant="secondary" className="mt-1">
                Industry avg: 45
              </Badge>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Cash Runway</p>
              <p className="text-lg font-semibold">8.5 months</p>
              <Badge variant="secondary" className="mt-1">
                At current burn
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
