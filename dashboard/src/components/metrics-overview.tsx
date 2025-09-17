import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Activity } from "lucide-react"

const metrics = [
  {
    title: "Monthly Revenue",
    value: "$45,231",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Active Customers",
    value: "150",
    change: "+8.2%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Profit Margin",
    value: "26.7%",
    change: "+2.1%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Customer Retention",
    value: "94.2%",
    change: "+1.3%",
    trend: "up",
    icon: Activity,
  },
]

export function MetricsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <Card key={metric.title} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{metric.value}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {metric.trend === "up" ? (
                <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={metric.trend === "up" ? "text-emerald-500" : "text-red-500"}>{metric.change}</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
