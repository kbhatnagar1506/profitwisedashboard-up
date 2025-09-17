import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const products = [
  {
    name: "Premium Plan",
    sales: 1234,
    revenue: "$12,340",
    progress: 85,
  },
  {
    name: "Basic Plan",
    sales: 856,
    revenue: "$8,560",
    progress: 65,
  },
  {
    name: "Enterprise Plan",
    sales: 432,
    revenue: "$21,600",
    progress: 45,
  },
  {
    name: "Starter Plan",
    sales: 234,
    revenue: "$2,340",
    progress: 25,
  },
]

export function TopProducts() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Top Products</CardTitle>
        <CardDescription className="text-muted-foreground">Best performing products this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {products.map((product) => (
            <div key={product.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-card-foreground">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                </div>
                <span className="text-sm font-medium text-card-foreground">{product.revenue}</span>
              </div>
              <Progress value={product.progress} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
