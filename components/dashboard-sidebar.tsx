"use client"

import {
  BarChart3,
  DollarSign,
  Users,
  Wallet,
  Share2,
  Lightbulb,
  Target,
  MessageSquare,
  Settings,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Overview", icon: BarChart3 },
  { name: "Financial Analytics", icon: DollarSign },
  { name: "Customer Intelligence", icon: Users },
  { name: "Growth Opportunities", icon: Target },
  { name: "Cash Flow", icon: Wallet },
  { name: "Social Media", icon: Share2 },
  { name: "AI Recommendations", icon: Lightbulb },
  { name: "AI Chat", icon: MessageSquare },
  { name: "Business Health", icon: Activity },
  { name: "Settings", icon: Settings },
]

interface DashboardSidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export function DashboardSidebar({ activeSection, setActiveSection }: DashboardSidebarProps) {
  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex flex-col h-full">
        <div className="px-4 py-6 border-b border-sidebar-border">
          <h2 className="text-lg font-semibold text-sidebar-foreground">Business Intelligence</h2>
          <p className="text-sm text-sidebar-foreground/60">AI-Powered Dashboard</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <Button
              key={item.name}
              variant={activeSection === item.name ? "secondary" : "ghost"}
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
              onClick={() => setActiveSection(item.name)}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-sidebar-border">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-sidebar-foreground/60">Health Score</span>
              <span className="font-semibold text-green-400">85%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-sidebar-foreground/60">Active Alerts</span>
              <span className="font-semibold text-yellow-400">1</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-sidebar-foreground/60">AI Insights</span>
              <span className="font-semibold text-blue-400">3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
