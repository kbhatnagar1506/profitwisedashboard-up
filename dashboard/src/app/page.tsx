"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { BusinessHealthOverview } from "@/components/business-health-overview"
import { MetricsOverview } from "@/components/metrics-overview"
import { FinancialAnalytics } from "@/components/financial-analytics"
import { CustomerIntelligence } from "@/components/customer-intelligence"
import { GrowthOpportunities } from "@/components/growth-opportunities"
import { CashFlowAnalysis } from "@/components/cash-flow-analysis"
import { SocialMediaAnalytics } from "@/components/social-media-analytics"
import { AIRecommendations } from "@/components/ai-recommendations"
import { AIChat } from "@/components/ai-chat"
import { QuickActions } from "@/components/quick-actions"
import { RecentTransactions } from "@/components/recent-transactions"
import { RevenueChart } from "@/components/revenue-chart"
import { ActivityChart } from "@/components/activity-chart"
import { TopProducts } from "@/components/top-products"
import { SettingsPage } from "@/components/settings-page"

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("Overview")

  const renderActiveSection = () => {
    switch (activeSection) {
      case "Overview":
        return (
          <div className="space-y-6">
            <BusinessHealthOverview />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MetricsOverview />
              <RevenueChart />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <RecentTransactions />
              <TopProducts />
              <ActivityChart />
            </div>
            <QuickActions />
          </div>
        )
      case "Financial Analytics":
        return <FinancialAnalytics />
      case "Customer Intelligence":
        return <CustomerIntelligence />
      case "Growth Opportunities":
        return <GrowthOpportunities />
      case "Cash Flow":
        return <CashFlowAnalysis />
      case "Social Media":
        return <SocialMediaAnalytics />
      case "AI Recommendations":
        return <AIRecommendations />
      case "AI Chat":
        return <AIChat />
      case "Business Health":
        return <BusinessHealthOverview />
      case "Settings":
        return <SettingsPage />
      default:
        return (
          <div className="space-y-6">
            <BusinessHealthOverview />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MetricsOverview />
              <RevenueChart />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <RecentTransactions />
              <TopProducts />
              <ActivityChart />
            </div>
            <QuickActions />
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {renderActiveSection()}
          </div>
        </main>
      </div>
    </div>
  )
}
