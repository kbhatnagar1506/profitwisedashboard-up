# ProfitWise Dashboard

A comprehensive AI-powered business intelligence dashboard built with Next.js, React, and Tailwind CSS.

## 🚀 Features

### 📊 **Core Dashboard Sections**

#### **1. Business Overview Dashboard**
- **Business Health Score** - Overall AI-calculated health percentage
- **Key Metrics Summary** - Revenue, costs, profit margins at a glance
- **Data Completeness** - How much of their profile is filled out
- **Last Updated** - When they last provided information

#### **2. Financial Analytics**
- **Revenue Analysis**
  - Monthly revenue trends
  - Revenue per customer
  - Revenue model breakdown (products/services/subscriptions)
  - Seasonality patterns
- **Cost Management**
  - Direct costs vs operating expenses
  - Top 5 suppliers and their impact
  - Fastest growing expenses
  - Waste/inefficiency tracking
- **Profitability Insights**
  - Unit economics tracking
  - Profit barriers identified
  - Cost-cutting opportunities
  - Revenue expansion opportunities

#### **3. Customer Intelligence**
- **Customer Metrics**
  - Customer Acquisition Cost (CAC)
  - Customer Lifetime Value (CLV)
  - Retention rates and churn analysis
  - Top 20% customers by value (Pareto analysis)
- **Customer Acquisition**
  - Lead generation effectiveness
  - Upselling/cross-selling success
  - Price change impact analysis

#### **4. Growth & Strategy**
- **Growth Opportunities**
  - AI-identified growth areas
  - Market expansion suggestions
  - Pricing optimization recommendations
- **Strategic Insights**
  - Competitive analysis from scraped data
  - Market positioning recommendations
  - Business model optimization

#### **5. Cash Flow & Financial Health**
- **Cash Flow Analysis**
  - Monthly inflow vs outflow
  - Cash shortage predictions
  - Debt management insights
- **Financial Tools Integration**
  - Current tools assessment
  - Recommendations for better tracking

#### **6. Social Media & Online Presence**
- **Social Media Analytics**
  - LinkedIn, Twitter, Instagram performance
  - Engagement metrics from scraped data
  - Brand sentiment analysis
- **Online Reputation**
  - Review analysis (Yelp, Google, Glassdoor)
  - Online presence optimization
  - SEO performance insights

#### **7. Document & Data Insights**
- **Uploaded Documents Analysis**
  - Financial statement insights
  - Contract analysis
  - Document completeness
- **Scraped Data Summary**
  - Website content analysis
  - Social media insights
  - Competitive intelligence

#### **8. AI Recommendations**
- **Action Items** - Prioritized list of improvements
- **Risk Alerts** - Potential issues identified
- **Opportunity Alerts** - Growth opportunities found
- **Next Steps** - AI-suggested actions

#### **9. Quick Actions**
- **Update Information** - Easy access to edit profile
- **Upload New Documents** - Drag & drop file upload
- **Voice Input** - Quick data entry via voice
- **Export Data** - Download reports

#### **10. Progress Tracking**
- **Goal Setting** - Set and track business goals
- **Milestone Tracking** - Progress toward objectives
- **Achievement Badges** - Gamification elements
- **Improvement Timeline** - Track changes over time

## 🎨 **Dashboard Design Features**

### **Visual Elements**
- **Color-coded Health Indicators** - Green (healthy), Yellow (caution), Red (needs attention)
- **Interactive Charts** - Revenue trends, cost breakdowns, customer metrics
- **Progress Bars** - Data completeness, goal achievement
- **Alert Notifications** - Important insights and recommendations

### **Responsive Layout**
- **Mobile-first Design** - Works on all devices
- **Collapsible Sections** - Expandable detailed views
- **Quick Toggle** - Switch between overview and detailed views
- **Customizable Widgets** - Users can arrange their dashboard

### **Real-time Updates**
- **Live Data Refresh** - Auto-update when new data is available
- **Notification System** - Alerts for important insights
- **Status Indicators** - Show when data is being processed

## 🛠 **Technology Stack**

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Theme**: Dark/Light mode support

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 **Project Structure**

```
dashboard/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles and CSS variables
│   │   ├── layout.tsx           # Root layout component
│   │   └── page.tsx             # Main dashboard page
│   └── components/
│       ├── ui/                  # Reusable UI components
│       ├── dashboard-header.tsx # Top navigation and search
│       ├── dashboard-sidebar.tsx # Side navigation
│       ├── business-health-overview.tsx # Health score and metrics
│       ├── financial-analytics.tsx # Revenue and cost analysis
│       ├── customer-intelligence.tsx # Customer insights
│       ├── growth-opportunities.tsx # AI growth recommendations
│       ├── cash-flow-analysis.tsx # Cash flow tracking
│       ├── social-media-analytics.tsx # Social media insights
│       ├── ai-recommendations.tsx # AI-powered suggestions
│       ├── ai-chat.tsx # Interactive AI chat
│       ├── quick-actions.tsx # Quick action buttons
│       └── ... # Other dashboard components
├── public/ # Static assets
├── package.json
└── README.md
```

## 🎯 **Key Components**

### **Dashboard Header**
- AI-powered search bar
- Business health indicator
- Notifications and alerts
- User profile access

### **Sidebar Navigation**
- Section-based navigation
- Health score summary
- Active alerts counter
- AI insights counter

### **Business Health Overview**
- Overall health percentage
- Key metrics cards
- Trend indicators
- Alert notifications

### **Financial Analytics**
- Interactive revenue/cost charts
- Profit margin analysis
- Key financial metrics
- Export capabilities

### **Customer Intelligence**
- Customer segmentation
- Retention analysis
- Journey funnel
- Customer insights

### **AI Recommendations**
- Prioritized action items
- Impact assessments
- Category-based organization
- Implementation tracking

## 🔧 **Customization**

### **Theming**
The dashboard supports both light and dark themes. CSS variables are defined in `globals.css` and can be customized:

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
  --primary: #171717;
  --secondary: #f4f4f5;
  /* ... more variables */
}
```

### **Adding New Sections**
1. Create a new component in `src/components/`
2. Import and add to the main page switch statement
3. Add navigation item to sidebar
4. Update the component exports

### **Data Integration**
The dashboard is designed to integrate with various data sources:
- REST APIs
- GraphQL endpoints
- Real-time data streams
- File uploads
- Voice input

## 📱 **Responsive Design**

The dashboard is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🚀 **Deployment**

### Vercel (Recommended)
1. Connect your GitHub repository
2. Deploy automatically on push
3. Environment variables can be set in Vercel dashboard

### Other Platforms
- Netlify
- AWS Amplify
- Railway
- Heroku

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 **License**

This project is part of the ProfitWise business intelligence platform.

## 🆘 **Support**

For support and questions:
- Check the documentation
- Open an issue on GitHub
- Contact the development team

---

**Built with ❤️ for business intelligence and growth optimization.**