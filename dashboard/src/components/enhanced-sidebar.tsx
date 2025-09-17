"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ChartColumn, 
  DollarSign, 
  Users, 
  Target, 
  Wallet, 
  Share2, 
  Lightbulb, 
  MessageSquare, 
  Activity, 
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Brain
} from "lucide-react"

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  badgeVariant?: "default" | "secondary" | "destructive" | "outline"
  isActive?: boolean
}

const navItems: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: ChartColumn,
    isActive: true
  },
  {
    id: 'financial',
    label: 'Financial Analytics',
    icon: DollarSign,
    badge: '3',
    badgeVariant: 'secondary'
  },
  {
    id: 'customers',
    label: 'Customer Intelligence',
    icon: Users,
    badge: 'New',
    badgeVariant: 'default'
  },
  {
    id: 'growth',
    label: 'Growth Opportunities',
    icon: Target
  },
  {
    id: 'cashflow',
    label: 'Cash Flow',
    icon: Wallet,
    badge: '1',
    badgeVariant: 'destructive'
  },
  {
    id: 'social',
    label: 'Social Media',
    icon: Share2
  },
  {
    id: 'recommendations',
    label: 'AI Recommendations',
    icon: Lightbulb,
    badge: '3',
    badgeVariant: 'secondary'
  },
  {
    id: 'chat',
    label: 'AI Chat',
    icon: MessageSquare
  },
  {
    id: 'health',
    label: 'Business Health',
    icon: Activity
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings
  }
]

interface HealthMetric {
  label: string
  value: string
  trend: 'up' | 'down' | 'stable'
  color: string
}

const healthMetrics: HealthMetric[] = [
  {
    label: 'Health Score',
    value: '85%',
    trend: 'up',
    color: 'text-green-400'
  },
  {
    label: 'Active Alerts',
    value: '1',
    trend: 'down',
    color: 'text-yellow-400'
  },
  {
    label: 'AI Insights',
    value: '3',
    trend: 'up',
    color: 'text-blue-400'
  }
]

export function EnhancedSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState('overview')

  return (
    <div className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-4 py-6 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-semibold text-sidebar-foreground">Business Intelligence</h2>
                <p className="text-sm text-sidebar-foreground/60">AI-Powered Dashboard</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 p-0"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeItem === item.id ? "secondary" : "ghost"}
              className={`w-full justify-start h-10 px-3 ${
                isCollapsed ? 'px-2' : ''
              } ${
                activeItem === item.id 
                  ? 'bg-sidebar-accent shadow-sm' 
                  : 'hover:bg-sidebar-accent'
              }`}
              onClick={() => setActiveItem(item.id)}
            >
              <item.icon className={`h-4 w-4 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge 
                      variant={item.badgeVariant || "secondary"} 
                      className="ml-2 h-5 px-1.5 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          ))}
        </nav>

        {/* Health Metrics */}
        {!isCollapsed && (
          <div className="px-4 py-4 border-t border-sidebar-border">
            <Card className="bg-sidebar-accent/50 border-sidebar-border">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-sidebar-foreground">AI Insights</span>
                </div>
                
                {healthMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-sidebar-foreground/60">{metric.label}</span>
                    <div className="flex items-center gap-1">
                      {metric.trend === 'up' && (
                        <TrendingUp className="h-3 w-3 text-green-400" />
                      )}
                      {metric.trend === 'down' && (
                        <AlertTriangle className="h-3 w-3 text-yellow-400" />
                      )}
                      <span className={`text-sm font-semibold ${metric.color}`}>
                        {metric.value}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Collapsed Health Indicator */}
        {isCollapsed && (
          <div className="px-2 py-4 border-t border-sidebar-border">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">85</span>
              </div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
