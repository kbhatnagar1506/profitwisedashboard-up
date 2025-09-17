import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const transactions = [
  {
    id: "1",
    customer: "John Doe",
    amount: "$250.00",
    status: "completed",
    date: "2 hours ago",
  },
  {
    id: "2",
    customer: "Jane Smith",
    amount: "$150.00",
    status: "pending",
    date: "4 hours ago",
  },
  {
    id: "3",
    customer: "Bob Johnson",
    amount: "$350.00",
    status: "completed",
    date: "6 hours ago",
  },
  {
    id: "4",
    customer: "Alice Brown",
    amount: "$75.00",
    status: "failed",
    date: "8 hours ago",
  },
]

export function RecentTransactions() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Recent Transactions</CardTitle>
        <CardDescription className="text-muted-foreground">Latest customer transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-card-foreground">{transaction.customer}</p>
                <p className="text-xs text-muted-foreground">{transaction.date}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={
                    transaction.status === "completed"
                      ? "default"
                      : transaction.status === "pending"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {transaction.status}
                </Badge>
                <span className="text-sm font-medium text-card-foreground">{transaction.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
