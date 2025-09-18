"use client"

import { useState, useEffect } from "react"
import { usePersistence } from "@/hooks/use-persistence"
import { EnhancedHeader } from "@/components/enhanced-header"
import { EnhancedSidebar } from "@/components/enhanced-sidebar"
import { BusinessHealthOverview } from "@/components/business-health-overview"
import { BusinessHealthDetailed } from "@/components/business-health-detailed"
import { MetricsOverview } from "@/components/metrics-overview"
import { FinancialAnalytics } from "@/components/financial-analytics"
import { CustomerIntelligence } from "@/components/customer-intelligence"
import { GrowthOpportunities } from "@/components/growth-opportunities"
import { CashFlowAnalysis } from "@/components/cash-flow-analysis"
import { SocialMediaAnalytics } from "@/components/social-media-analytics"
import { AIRecommendations } from "@/components/ai-recommendations"
import { AIChat } from "@/components/ai-chat"
import { FinancialAudit } from "@/components/financial-audit"
import { QuickActions } from "@/components/quick-actions"
import { RecentTransactions } from "@/components/recent-transactions"
import { RevenueChart, CustomerSegmentsChart, ProductPerformanceChart } from "@/components/enhanced-charts"
import { ActivityChart } from "@/components/activity-chart"
import { TopProducts } from "@/components/top-products"
import { SettingsPage } from "@/components/settings-page"
import { AIAnalysisDisplay } from "@/components/ai-analysis-display"

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("Overview")
  const [isLoading, setIsLoading] = useState(true)
  const { debouncedSave, loadState } = usePersistence()

  // Load saved state on mount
  useEffect(() => {
    const loadSavedState = async () => {
      try {
        const savedState = await loadState()
        if (savedState?.dashboard_state) {
          setActiveSection(savedState.dashboard_state.active_section || "Overview")
        }
      } catch (error) {
        console.error('Failed to load saved state:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSavedState()
  }, [loadState])

  // Save state when activeSection changes
  useEffect(() => {
    if (!isLoading) {
      debouncedSave({
        activeSection,
        viewedSections: [activeSection],
        interactions: [{
          type: 'section_change',
          section: activeSection,
          timestamp: new Date().toISOString()
        }]
      })
    }
  }, [activeSection, debouncedSave, isLoading])

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CustomerSegmentsChart />
              <ProductPerformanceChart />
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
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AIChat />
            </div>
            <div className="space-y-6">
              <AIRecommendations />
              <QuickActions />
            </div>
          </div>
        )
      case "AI Analysis":
        return <AIAnalysisDisplay />
      case "Business Health":
        return <BusinessHealthDetailed />
      case "Financial Audit":
        return <FinancialAudit />
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CustomerSegmentsChart />
              <ProductPerformanceChart />
            </div>
            <QuickActions />
          </div>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <EnhancedHeader />
      <div className="flex">
        <EnhancedSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {renderActiveSection()}
          </div>
        </main>
      </div>
    </div>
  )
}
