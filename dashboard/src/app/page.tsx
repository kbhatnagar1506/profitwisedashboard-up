"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { BusinessHealthOverview } from "@/components/business-health-overview"
import { FinancialAnalytics } from "@/components/financial-analytics"
import { CustomerIntelligence } from "@/components/customer-intelligence"
import { GrowthOpportunities } from "@/components/growth-opportunities"
import { CashFlowAnalysis } from "@/components/cash-flow-analysis"
import { SocialMediaAnalytics } from "@/components/social-media-analytics"
import { AIRecommendations } from "@/components/ai-recommendations"
import { QuickActions } from "@/components/quick-actions"
import { AIChat } from "@/components/ai-chat"
import { SettingsPage } from "@/components/settings-page"

interface BusinessData {
  business_name?: string
  category?: string
  website_url?: string
  created_at?: string
}

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("Overview")
  const [businessData, setBusinessData] = useState<BusinessData>({})
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check authentication and fetch business data
    const checkAuthAndFetchData = async () => {
      try {
        const response = await fetch('/api/business-data', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setBusinessData(data)
          setAuthenticated(true)
        } else {
          // Not authenticated, redirect to login
          router.push('/login')
        }
      } catch (error) {
        console.error('Error fetching business data:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetchData()
  }, [router])

  const renderActiveSection = () => {
    switch (activeSection) {
      case "Overview":
        return (
          <div className="space-y-6">
            <BusinessHealthOverview businessData={businessData} />
            <AIRecommendations />
            <QuickActions />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <FinancialAnalytics />
              <CustomerIntelligence />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <GrowthOpportunities />
              <CashFlowAnalysis />
            </div>
            <SocialMediaAnalytics />
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
        return <BusinessHealthOverview businessData={businessData} />
      case "Settings":
        return <SettingsPage />
      default:
        return <div>Section not found</div>
    }
  }

  if (loading || !authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            {loading ? 'Loading your dashboard...' : 'Redirecting to login...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <main className="flex-1 p-6">
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">{activeSection}</h1>
                <p className="text-muted-foreground">
                  {activeSection === "Overview" && "AI-powered insights for your business growth"}
                  {activeSection === "Financial Analytics" && "Comprehensive financial performance analysis"}
                  {activeSection === "Customer Intelligence" && "Deep insights into customer behavior and metrics"}
                  {activeSection === "Growth Opportunities" && "AI-identified opportunities for business expansion"}
                  {activeSection === "Cash Flow" && "Real-time cash flow monitoring and forecasting"}
                  {activeSection === "Social Media" && "Social media performance and engagement analytics"}
                  {activeSection === "AI Recommendations" && "Personalized AI-driven business recommendations"}
                  {activeSection === "AI Chat" && "Chat with your AI business advisor"}
                  {activeSection === "Business Health" && "Overall business health score and metrics"}
                  {activeSection === "Settings" && "Configure your dashboard preferences"}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Last Updated: 2 days ago
              </div>
            </div>
          </div>

          {renderActiveSection()}
        </main>
      </div>
    </div>
  )
}