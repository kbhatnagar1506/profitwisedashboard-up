import { Search, Bell, User, Brain, TrendingUp, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Brain className="text-white h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-foreground">Business AI</span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">Health: 85%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Ask AI about your business metrics..." className="pl-10 bg-background border-border" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">+12.5%</span>
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              1
            </Badge>
          </Button>

          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="px-6 py-2 bg-yellow-50 border-b border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800">
        <div className="flex items-center gap-2 text-sm">
          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          <span className="text-slate-900 font-medium dark:text-slate-100">Business Alert:</span>
          <span className="text-slate-800 dark:text-slate-200">
            Cash flow projection shows potential shortage in Q3 - Review recommended actions
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-slate-900 hover:text-slate-700 dark:text-slate-100 dark:hover:text-slate-300"
          >
            View Details
          </Button>
        </div>
      </div>
    </header>
  )
}
