"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  Upload,
  Download,
  FileText,
  BarChart3,
  Users,
  DollarSign,
  Settings,
  MessageSquare,
  Calendar,
  Bell,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Eye,
  Edit,
  Trash2,
  Copy,
  Share2,
  RefreshCw,
  Search,
  Filter,
  MoreHorizontal
} from "lucide-react"

interface QuickAction {
  id: string
  label: string
  icon: React.ElementType
  description: string
  category: "financial" | "customer" | "growth" | "analytics" | "system" | "communication"
  action: () => void
  badge?: string
  badgeVariant?: "default" | "secondary" | "destructive" | "outline"
}

interface QuickActionsUniversalProps {
  variant?: "sidebar" | "header" | "floating" | "inline"
  showCategories?: boolean
  maxItems?: number
  className?: string
}

export function QuickActionsUniversal({ 
  variant = "inline", 
  showCategories = true, 
  maxItems = 6,
  className = ""
}: QuickActionsUniversalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const quickActions: QuickAction[] = [
    {
      id: "add-transaction",
      label: "Add Transaction",
      icon: Plus,
      description: "Record a new financial transaction",
      category: "financial",
      action: () => console.log("Add transaction clicked"),
      badge: "New",
      badgeVariant: "default"
    },
    {
      id: "upload-documents",
      label: "Upload Documents",
      icon: Upload,
      description: "Upload financial documents and receipts",
      category: "financial",
      action: () => console.log("Upload documents clicked")
    },
    {
      id: "generate-report",
      label: "Generate Report",
      icon: FileText,
      description: "Create financial or business reports",
      category: "analytics",
      action: () => console.log("Generate report clicked")
    },
    {
      id: "export-data",
      label: "Export Data",
      icon: Download,
      description: "Export dashboard data to various formats",
      category: "analytics",
      action: () => console.log("Export data clicked")
    },
    {
      id: "ai-chat",
      label: "AI Chat",
      icon: MessageSquare,
      description: "Chat with ProfitWi$e AI assistant",
      category: "communication",
      action: () => console.log("AI chat clicked")
    },
    {
      id: "schedule-meeting",
      label: "Schedule Meeting",
      icon: Calendar,
      description: "Schedule a business consultation",
      category: "communication",
      action: () => console.log("Schedule meeting clicked")
    },
    {
      id: "add-customer",
      label: "Add Customer",
      icon: Users,
      description: "Add a new customer to the system",
      category: "customer",
      action: () => console.log("Add customer clicked")
    },
    {
      id: "view-analytics",
      label: "View Analytics",
      icon: BarChart3,
      description: "Access detailed business analytics",
      category: "analytics",
      action: () => console.log("View analytics clicked")
    },
    {
      id: "growth-strategy",
      label: "Growth Strategy",
      icon: Target,
      description: "Plan and track growth initiatives",
      category: "growth",
      action: () => console.log("Growth strategy clicked")
    },
    {
      id: "financial-audit",
      label: "Financial Audit",
      icon: Shield,
      description: "Conduct financial audit and compliance check",
      category: "financial",
      action: () => console.log("Financial audit clicked")
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      description: "Configure dashboard and system settings",
      category: "system",
      action: () => console.log("Settings clicked")
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      description: "Manage alerts and notifications",
      category: "system",
      action: () => console.log("Notifications clicked")
    }
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "financial": return "text-green-600 bg-green-50 dark:bg-green-950"
      case "customer": return "text-blue-600 bg-blue-50 dark:bg-blue-950"
      case "growth": return "text-purple-600 bg-purple-50 dark:bg-purple-950"
      case "analytics": return "text-orange-600 bg-orange-50 dark:bg-orange-950"
      case "system": return "text-gray-600 bg-gray-50 dark:bg-gray-950"
      case "communication": return "text-pink-600 bg-pink-50 dark:bg-pink-950"
      default: return "text-gray-600 bg-gray-50 dark:bg-gray-950"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "financial": return DollarSign
      case "customer": return Users
      case "growth": return TrendingUp
      case "analytics": return BarChart3
      case "system": return Settings
      case "communication": return MessageSquare
      default: return MoreHorizontal
    }
  }

  const filteredActions = maxItems ? quickActions.slice(0, maxItems) : quickActions

  if (variant === "sidebar") {
    return (
      <div className={`space-y-2 ${className}`}>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Quick Actions</h3>
        {filteredActions.map((action) => (
          <Button
            key={action.id}
            variant="ghost"
            size="sm"
            className="w-full justify-start h-8 px-2 text-xs"
            onClick={action.action}
          >
            <action.icon className="h-3 w-3 mr-2" />
            <span className="flex-1 text-left">{action.label}</span>
            {action.badge && (
              <Badge variant={action.badgeVariant} className="ml-1 text-xs">
                {action.badge}
              </Badge>
            )}
          </Button>
        ))}
      </div>
    )
  }

  if (variant === "header") {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {filteredActions.slice(0, 4).map((action) => (
          <Button
            key={action.id}
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs"
            onClick={action.action}
          >
            <action.icon className="h-3 w-3 mr-1" />
            {action.label}
          </Button>
        ))}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 px-2">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>More Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {filteredActions.slice(4).map((action) => (
              <DropdownMenuItem key={action.id} onClick={action.action}>
                <action.icon className="h-4 w-4 mr-2" />
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  if (variant === "floating") {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              size="lg"
              className="h-14 w-14 rounded-full shadow-lg"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Zap className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-2">
            <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="grid grid-cols-2 gap-1">
              {filteredActions.map((action) => (
                <DropdownMenuItem
                  key={action.id}
                  onClick={action.action}
                  className="flex flex-col items-center p-3 h-auto"
                >
                  <action.icon className="h-5 w-5 mb-1" />
                  <span className="text-xs text-center">{action.label}</span>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  // Default inline variant
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Zap className="h-4 w-4" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {showCategories ? (
          <div className="space-y-4">
            {["financial", "customer", "growth", "analytics", "system", "communication"].map((category) => {
              const categoryActions = quickActions.filter(action => action.category === category)
              const CategoryIcon = getCategoryIcon(category)
              
              if (categoryActions.length === 0) return null
              
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <CategoryIcon className="h-3 w-3" />
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {categoryActions.slice(0, 2).map((action) => (
                      <Button
                        key={action.id}
                        variant="ghost"
                        size="sm"
                        className="justify-start h-8 text-xs"
                        onClick={action.action}
                      >
                        <action.icon className="h-3 w-3 mr-2" />
                        <span className="flex-1 text-left">{action.label}</span>
                        {action.badge && (
                          <Badge variant={action.badgeVariant} className="ml-1 text-xs">
                            {action.badge}
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {filteredActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                className="h-10 text-xs"
                onClick={action.action}
              >
                <action.icon className="h-3 w-3 mr-1" />
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
