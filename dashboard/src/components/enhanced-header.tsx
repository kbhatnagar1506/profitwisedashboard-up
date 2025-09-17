"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  Moon, 
  Sun,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react"

interface Alert {
  id: string
  type: 'warning' | 'error' | 'success' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

const sampleAlerts: Alert[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Cash Flow Alert',
    message: 'Q3 projection shows potential shortage',
    timestamp: new Date(Date.now() - 3600000),
    read: false
  },
  {
    id: '2',
    type: 'success',
    title: 'Goal Achieved',
    message: 'Monthly revenue target exceeded by 12%',
    timestamp: new Date(Date.now() - 7200000),
    read: true
  },
  {
    id: '3',
    type: 'info',
    title: 'New Feature',
    message: 'AI recommendations are now available',
    timestamp: new Date(Date.now() - 86400000),
    read: true
  }
]

export function EnhancedHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [alerts] = useState<Alert[]>(sampleAlerts)
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  const unreadAlerts = alerts.filter(alert => !alert.read).length

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
    console.log('Searching for:', searchQuery)
  }

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'info':
        return <TrendingUp className="h-4 w-4 text-blue-500" />
    }
  }

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950'
      case 'error':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
      case 'success':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
      case 'info':
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950'
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-16 items-center px-6">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 flex items-center justify-center">
                    <img
                      src="/profitwiseicon1.png"
                      alt="ProfitWi$e Logo"
                      className="h-10 w-10 object-contain"
                    />
                  </div>
            <div>
              <span className="font-bold text-foreground text-lg">ProfitWi$e</span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">Health: 85%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 flex items-center justify-center px-6">
          <form onSubmit={handleSearch} className="w-full max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Ask AI about your business metrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-9 bg-background/50 border-border/50 focus:bg-background focus:border-ring transition-all"
            />
          </form>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Growth Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">+12.5%</span>
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative h-9 w-9">
                <Bell className="h-4 w-4" />
                {unreadAlerts > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {unreadAlerts}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                <Badge variant="secondary">{alerts.length}</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {alerts.map((alert) => (
                <DropdownMenuItem key={alert.id} className="p-0">
                  <div className={`w-full p-3 rounded-lg border ${getAlertColor(alert.type)} ${!alert.read ? 'ring-2 ring-primary/20' : ''}`}>
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{alert.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {alert.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      {!alert.read && (
                        <div className="w-2 h-2 bg-primary rounded-full mt-1"></div>
                      )}
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="h-9 w-9"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/user-avatar.png" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Demo User</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    demo@profitwise.app
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Alert Banner */}
      {unreadAlerts > 0 && (
        <div className="px-6 py-2 bg-yellow-50 border-b border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800">
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-slate-900 font-medium dark:text-slate-100">
              Business Alert:
            </span>
            <span className="text-slate-800 dark:text-slate-200">
              Cash flow projection shows potential shortage in Q3 - Review recommended actions
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-auto h-6 px-2 text-slate-900 hover:text-slate-700 dark:text-slate-100 dark:hover:text-slate-300"
            >
              View Details
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
