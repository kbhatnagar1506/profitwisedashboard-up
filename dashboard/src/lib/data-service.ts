// Data service for fetching real business data from Flask API
import { 
  safeApiCall, 
  createErrorContext, 
  ProfitWiseError, 
  NetworkError,
  handleApiError,
  handleNetworkError
} from './error-handler'

export interface BusinessInfo {
  name: string
  category: string
  website: string
  completion_date: string
  data_completeness: number
}

export interface FinancialMetrics {
  monthly_revenue: number
  revenue_per_customer: number
  customer_acquisition_cost: number
  estimated_customers: number
  profit_margin: number
  cash_flow_in: number
  cash_flow_out: number
  net_cash_flow: number
}

export interface CustomerMetrics {
  retention_rate: number
  revenue_model: string
  seasonality: string
  top_customers: string
  upsell_cross_sell: string
}

export interface GrowthMetrics {
  last_price_change: string
  lead_generation: string
  profit_barriers: string
  opportunities: string
  unit_economics: string
}

export interface OperationalMetrics {
  direct_costs: string
  operating_expenses: string
  fastest_growing_expenses: string
  waste_tracking: string
  financial_tools: string
}

export interface SocialMedia {
  linkedin: string
  twitter: string
  instagram: string
  facebook: string
  tiktok_youtube: string
}

export interface Reputation {
  yelp: string
  google_business: string
  glassdoor: string
  app_store: string
}

export interface Analytics {
  google_analytics: string
  seo_tools: string
  ecommerce_platforms: string
  ad_platforms: string
}

export interface BusinessAlert {
  type: 'warning' | 'info' | 'success' | 'error'
  title: string
  message: string
}

export interface BusinessRecommendation {
  category: string
  title: string
  description: string
}

export interface DashboardData {
  business_info: BusinessInfo
  financial_metrics: FinancialMetrics
  customer_metrics: CustomerMetrics
  growth_metrics: GrowthMetrics
  operational_metrics: OperationalMetrics
  social_media: SocialMedia
  reputation: Reputation
  analytics: Analytics
  health_score: number
  alerts: BusinessAlert[]
  recommendations: BusinessRecommendation[]
}

class DataService {
  private baseUrl: string

  constructor() {
    // Use Flask API URL - in production this would be the Heroku URL
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://profitwise-app-2024-9e182e64be35.herokuapp.com'
      : 'http://localhost:5000'
  }

  async fetchDashboardData(): Promise<DashboardData> {
    const context = createErrorContext('DataService', 'fetchDashboardData')
    
    try {
      return await safeApiCall(async () => {
        const response = await fetch(`${this.baseUrl}/api/dashboard-data`, {
          method: 'GET',
          credentials: 'include', // Include cookies for session
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          await handleApiError(response, context)
        }

        return await response.json()
      }, context)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Return mock data as fallback
      return this.getMockData()
    }
  }

  async processDocuments(documents: any[]): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/process-documents`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documents }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error processing documents:', error)
      throw error
    }
  }

  async saveDashboardState(state: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/save-dashboard-state`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(state),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error saving dashboard state:', error)
      throw error
    }
  }

  async getDashboardState(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/get-dashboard-state`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting dashboard state:', error)
      return null
    }
  }

  async exportUserData(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/export-user-data`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error exporting user data:', error)
      throw error
    }
  }

  async importUserData(data: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/import-user-data`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error importing user data:', error)
      throw error
    }
  }

  async runAIAnalysis(): Promise<any> {
    const context = createErrorContext('DataService', 'runAIAnalysis')
    
    return safeApiCall(async () => {
      const response = await fetch(`${this.baseUrl}/api/ai-analysis`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        await handleApiError(response, context)
      }

      return await response.json()
    }, context, 2) // Reduced retries for AI calls
  }

  async getAIInsights(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ai-insights`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting AI insights:', error)
      return null
    }
  }

  async sendAIMessage(message: string): Promise<any> {
    const context = createErrorContext('DataService', 'sendAIMessage')
    
    return safeApiCall(async () => {
      const response = await fetch(`${this.baseUrl}/api/ai-chat`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      })

      if (!response.ok) {
        await handleApiError(response, context)
      }

      return await response.json()
    }, context, 2) // Reduced retries for AI calls
  }

  private getMockData(): DashboardData {
    return {
      business_info: {
        name: 'Your Business',
        category: 'Technology',
        website: 'https://yourbusiness.com',
        completion_date: new Date().toISOString(),
        data_completeness: 85
      },
      financial_metrics: {
        monthly_revenue: 45000,
        revenue_per_customer: 500,
        customer_acquisition_cost: 150,
        estimated_customers: 90,
        profit_margin: 26.7,
        cash_flow_in: 60000,
        cash_flow_out: 45000,
        net_cash_flow: 15000
      },
      customer_metrics: {
        retention_rate: 94.2,
        revenue_model: 'subscriptions',
        seasonality: 'moderate',
        top_customers: 'Enterprise clients, SMBs',
        upsell_cross_sell: 'yes'
      },
      growth_metrics: {
        last_price_change: '6 months ago',
        lead_generation: 'digital marketing',
        profit_barriers: 'High customer acquisition costs',
        opportunities: 'International expansion, new product lines',
        unit_economics: 'yes'
      },
      operational_metrics: {
        direct_costs: 'Server costs, third-party services',
        operating_expenses: 'Salaries, marketing, office rent',
        fastest_growing_expenses: 'Marketing and customer acquisition',
        waste_tracking: 'yes',
        financial_tools: 'QuickBooks, custom analytics'
      },
      social_media: {
        linkedin: 'https://linkedin.com/company/yourbusiness',
        twitter: '@yourbusiness',
        instagram: '@yourbusiness',
        facebook: 'https://facebook.com/yourbusiness',
        tiktok_youtube: 'https://youtube.com/yourbusiness'
      },
      reputation: {
        yelp: 'https://yelp.com/biz/yourbusiness',
        google_business: 'https://g.page/yourbusiness',
        glassdoor: 'https://glassdoor.com/company/yourbusiness',
        app_store: 'https://apps.apple.com/app/yourbusiness'
      },
      analytics: {
        google_analytics: 'GA4 implemented',
        seo_tools: 'SEMrush, Ahrefs',
        ecommerce_platforms: 'Shopify, WooCommerce',
        ad_platforms: 'Google Ads, Facebook Ads'
      },
      health_score: 85,
      alerts: [
        {
          type: 'warning',
          title: 'Cash Flow Alert',
          message: 'Monitor your cash flow projections for Q3'
        }
      ],
      recommendations: [
        {
          category: 'Growth',
          title: 'Expand Social Media Presence',
          description: 'Increase your social media presence to reach more customers'
        },
        {
          category: 'Operations',
          title: 'Implement Advanced Analytics',
          description: 'Use more sophisticated analytics tools for better insights'
        }
      ]
    }
  }
}

export const dataService = new DataService()
