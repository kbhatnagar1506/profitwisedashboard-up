"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  ScatterChart,
  Scatter
} from "recharts"
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calculator, 
  Shield, 
  Eye,
  Download,
  Filter,
  Search,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  AlertCircle,
  Clock,
  Target,
  Users,
  CreditCard,
  Banknote,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Zap
} from "lucide-react"

const auditData = [
  { 
    customer: "Acme Corp", 
    revenue: 125000, 
    expenses: 85000, 
    profit: 40000, 
    riskScore: 15, 
    status: "Low Risk",
    lastAudit: "2024-01-15",
    compliance: 95,
    transactions: 245,
    avgTransaction: 510,
    growthRate: 12.5
  },
  { 
    customer: "TechStart Inc", 
    revenue: 85000, 
    expenses: 65000, 
    profit: 20000, 
    riskScore: 35, 
    status: "Medium Risk",
    lastAudit: "2024-01-10",
    compliance: 87,
    transactions: 180,
    avgTransaction: 472,
    growthRate: 8.2
  },
  { 
    customer: "Global Solutions", 
    revenue: 250000, 
    expenses: 180000, 
    profit: 70000, 
    riskScore: 8, 
    status: "Low Risk",
    lastAudit: "2024-01-20",
    compliance: 98,
    transactions: 420,
    avgTransaction: 595,
    growthRate: 15.8
  },
  { 
    customer: "StartupXYZ", 
    revenue: 45000, 
    expenses: 55000, 
    profit: -10000, 
    riskScore: 75, 
    status: "High Risk",
    lastAudit: "2024-01-05",
    compliance: 72,
    transactions: 95,
    avgTransaction: 474,
    growthRate: -5.2
  },
  { 
    customer: "Enterprise Ltd", 
    revenue: 500000, 
    expenses: 350000, 
    profit: 150000, 
    riskScore: 12, 
    status: "Low Risk",
    lastAudit: "2024-01-18",
    compliance: 96,
    transactions: 680,
    avgTransaction: 735,
    growthRate: 18.3
  }
]

const auditTrends = [
  { month: "Jan", audits: 12, issues: 3, resolved: 8, pending: 1 },
  { month: "Feb", audits: 15, issues: 2, resolved: 12, pending: 1 },
  { month: "Mar", audits: 18, issues: 4, resolved: 14, pending: 0 },
  { month: "Apr", audits: 22, issues: 3, resolved: 18, pending: 1 },
  { month: "May", audits: 25, issues: 2, resolved: 22, pending: 1 },
  { month: "Jun", audits: 28, issues: 5, resolved: 23, pending: 0 },
]

const complianceMetrics = [
  { category: "Financial Records", score: 95, status: "Excellent", issues: 2 },
  { category: "Tax Compliance", score: 88, status: "Good", issues: 5 },
  { category: "Expense Tracking", score: 92, status: "Excellent", issues: 3 },
  { category: "Revenue Recognition", score: 90, status: "Good", issues: 4 },
  { category: "Cash Flow Management", score: 85, status: "Good", issues: 6 },
  { category: "Audit Trail", score: 97, status: "Excellent", issues: 1 },
]

const riskCategories = [
  { name: "Low Risk", value: 45, color: "#10b981", count: 9 },
  { name: "Medium Risk", value: 30, color: "#f59e0b", count: 6 },
  { name: "High Risk", value: 15, color: "#ef4444", count: 3 },
  { name: "Critical Risk", value: 10, color: "#dc2626", count: 2 },
]

const auditFindings = [
  {
    id: 1,
    customer: "StartupXYZ",
    severity: "High",
    category: "Financial Health",
    description: "Negative profit margin for 3 consecutive months",
    recommendation: "Review pricing strategy and cost structure",
    status: "Open",
    dueDate: "2024-02-15",
    assignedTo: "John Smith"
  },
  {
    id: 2,
    customer: "TechStart Inc",
    severity: "Medium",
    category: "Compliance",
    description: "Missing documentation for 15% of transactions",
    recommendation: "Implement automated documentation system",
    status: "In Progress",
    dueDate: "2024-02-10",
    assignedTo: "Sarah Johnson"
  },
  {
    id: 3,
    customer: "Acme Corp",
    severity: "Low",
    category: "Process Improvement",
    description: "Opportunity to optimize expense categorization",
    recommendation: "Standardize expense categories and implement training",
    status: "Resolved",
    dueDate: "2024-01-30",
    assignedTo: "Mike Davis"
  }
]

const auditReports = [
  {
    id: "AR-2024-001",
    customer: "Acme Corp",
    period: "FY 2023",
    opinion: "Unqualified",
    status: "Completed",
    date: "2024-01-15",
    auditor: "John Smith, CPA",
    materiality: 50000,
    keyMatters: ["Revenue Recognition", "Inventory Valuation"],
    findings: 3,
    recommendations: 5
  },
  {
    id: "AR-2024-002", 
    customer: "TechStart Inc",
    period: "FY 2023",
    opinion: "Qualified",
    status: "Completed",
    date: "2024-01-10",
    auditor: "Sarah Johnson, CPA",
    materiality: 25000,
    keyMatters: ["Documentation Gaps", "Internal Controls"],
    findings: 7,
    recommendations: 8
  },
  {
    id: "AR-2024-003",
    customer: "Global Solutions",
    period: "FY 2023", 
    opinion: "Unqualified",
    status: "Completed",
    date: "2024-01-20",
    auditor: "Mike Davis, CPA",
    materiality: 100000,
    keyMatters: ["Revenue Recognition", "Asset Valuation"],
    findings: 2,
    recommendations: 3
  },
  {
    id: "AR-2024-004",
    customer: "StartupXYZ",
    period: "FY 2023",
    opinion: "Adverse",
    status: "In Progress",
    date: "2024-01-05",
    auditor: "Lisa Chen, CPA",
    materiality: 15000,
    keyMatters: ["Going Concern", "Revenue Recognition"],
    findings: 12,
    recommendations: 15
  }
]

const engagementLetters = [
  {
    id: "EL-2024-001",
    customer: "Acme Corp",
    status: "Active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    scope: "Full Financial Audit",
    fee: 45000,
    deliverables: ["Audit Report", "Management Letter", "Compliance Certificate"]
  },
  {
    id: "EL-2024-002",
    customer: "TechStart Inc", 
    status: "Active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    scope: "Full Financial Audit",
    fee: 32000,
    deliverables: ["Audit Report", "Management Letter", "Compliance Certificate"]
  },
  {
    id: "EL-2024-003",
    customer: "Global Solutions",
    status: "Active", 
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    scope: "Full Financial Audit",
    fee: 75000,
    deliverables: ["Audit Report", "Management Letter", "Compliance Certificate"]
  }
]

const auditWorkingPapers = [
  {
    section: "Planning & Risk Assessment",
    papers: [
      { name: "Client Acceptance Form", status: "Complete", reviewer: "John Smith" },
      { name: "Risk Assessment Matrix", status: "Complete", reviewer: "Sarah Johnson" },
      { name: "Materiality Calculation", status: "Complete", reviewer: "Mike Davis" },
      { name: "Audit Strategy Document", status: "Complete", reviewer: "John Smith" }
    ]
  },
  {
    section: "Internal Controls Testing",
    papers: [
      { name: "Control Environment Assessment", status: "Complete", reviewer: "Lisa Chen" },
      { name: "IT Controls Testing", status: "In Progress", reviewer: "Mike Davis" },
      { name: "Segregation of Duties Review", status: "Complete", reviewer: "Sarah Johnson" },
      { name: "Authorization Controls Test", status: "Complete", reviewer: "John Smith" }
    ]
  },
  {
    section: "Substantive Procedures",
    papers: [
      { name: "Cash & Bank Confirmations", status: "Complete", reviewer: "Sarah Johnson" },
      { name: "Accounts Receivable Aging", status: "Complete", reviewer: "Mike Davis" },
      { name: "Inventory Count & Valuation", status: "In Progress", reviewer: "Lisa Chen" },
      { name: "Revenue Recognition Testing", status: "Complete", reviewer: "John Smith" }
    ]
  }
]

const auditMetrics = {
  totalCustomers: 20,
  auditedCustomers: 18,
  pendingAudits: 2,
  averageRiskScore: 28,
  complianceRate: 91,
  criticalIssues: 2,
  resolvedIssues: 45,
  averageAuditTime: 3.2,
  totalEngagements: 15,
  activeEngagements: 12,
  completedReports: 8,
  pendingReports: 4
}

export function FinancialAudit() {
  const [activeView, setActiveView] = useState<"overview" | "customers" | "findings" | "compliance" | "reports" | "engagement">("overview")
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [selectedAuditReport, setSelectedAuditReport] = useState<string | null>(null)

  const getRiskColor = (riskScore: number) => {
    if (riskScore <= 20) return "text-green-600"
    if (riskScore <= 40) return "text-yellow-600"
    if (riskScore <= 60) return "text-orange-600"
    return "text-red-600"
  }

  const getRiskBadgeVariant = (riskScore: number) => {
    if (riskScore <= 20) return "default"
    if (riskScore <= 40) return "secondary"
    if (riskScore <= 60) return "outline"
    return "destructive"
  }

  return (
    <div className="space-y-6">
      {/* Main Financial Audit Dashboard */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Financial Audit Dashboard
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant={activeView === "overview" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("overview")}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </Button>
              <Button
                variant={activeView === "customers" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("customers")}
              >
                <Users className="w-4 h-4 mr-2" />
                Customers
              </Button>
              <Button
                variant={activeView === "findings" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("findings")}
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Findings
              </Button>
              <Button
                variant={activeView === "compliance" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("compliance")}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Compliance
              </Button>
              <Button
                variant={activeView === "reports" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("reports")}
              >
                <FileText className="w-4 h-4 mr-2" />
                Reports
              </Button>
              <Button
                variant={activeView === "engagement" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("engagement")}
              >
                <Shield className="w-4 h-4 mr-2" />
                Engagement
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Audit Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700 dark:text-green-300">Audited Customers</span>
              </div>
              <p className="text-2xl font-bold text-green-800 dark:text-green-200">{auditMetrics.auditedCustomers}/{auditMetrics.totalCustomers}</p>
              <Progress value={(auditMetrics.auditedCustomers / auditMetrics.totalCustomers) * 100} className="h-2" />
              <p className="text-xs text-green-600 dark:text-green-400">90% completion rate</p>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700 dark:text-blue-300">Compliance Rate</span>
              </div>
              <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">{auditMetrics.complianceRate}%</p>
              <Progress value={auditMetrics.complianceRate} className="h-2" />
              <p className="text-xs text-blue-600 dark:text-blue-400">Overall compliance</p>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-orange-700 dark:text-orange-300">Critical Issues</span>
              </div>
              <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">{auditMetrics.criticalIssues}</p>
              <Progress value={auditMetrics.criticalIssues * 10} className="h-2" />
              <p className="text-xs text-orange-600 dark:text-orange-400">Require immediate attention</p>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-purple-700 dark:text-purple-300">Avg Audit Time</span>
              </div>
              <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">{auditMetrics.averageAuditTime} days</p>
              <Progress value={80} className="h-2" />
              <p className="text-xs text-purple-600 dark:text-purple-400">Per customer audit</p>
            </div>
          </div>

          {/* Dynamic Content Based on Active View */}
          {activeView === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Audit Trends
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={auditTrends}>
                      <defs>
                        <linearGradient id="colorAudits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorIssues" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Area type="monotone" dataKey="audits" stroke="#3b82f6" fill="url(#colorAudits)" strokeWidth={2} />
                      <Area type="monotone" dataKey="issues" stroke="#ef4444" fill="url(#colorIssues)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4" />
                  Risk Distribution
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskCategories}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {riskCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeView === "customers" && (
            <div className="space-y-6">
              <h4 className="font-semibold">Customer Financial Audit Status</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Customer</th>
                      <th className="text-right p-3 font-medium">Revenue</th>
                      <th className="text-right p-3 font-medium">Profit</th>
                      <th className="text-right p-3 font-medium">Risk Score</th>
                      <th className="text-center p-3 font-medium">Status</th>
                      <th className="text-center p-3 font-medium">Compliance</th>
                      <th className="text-center p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditData.map((customer, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{customer.customer}</p>
                            <p className="text-xs text-muted-foreground">Last audit: {customer.lastAudit}</p>
                          </div>
                        </td>
                        <td className="text-right p-3">
                          <p className="font-semibold">${customer.revenue.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{customer.transactions} transactions</p>
                        </td>
                        <td className="text-right p-3">
                          <p className={`font-semibold ${customer.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${customer.profit.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {customer.profit >= 0 ? '+' : ''}{((customer.profit / customer.revenue) * 100).toFixed(1)}%
                          </p>
                        </td>
                        <td className="text-right p-3">
                          <p className={`font-semibold ${getRiskColor(customer.riskScore)}`}>
                            {customer.riskScore}
                          </p>
                        </td>
                        <td className="text-center p-3">
                          <Badge variant={getRiskBadgeVariant(customer.riskScore)}>
                            {customer.status}
                          </Badge>
                        </td>
                        <td className="text-center p-3">
                          <div className="flex items-center justify-center gap-2">
                            <Progress value={customer.compliance} className="w-16 h-2" />
                            <span className="text-xs">{customer.compliance}%</span>
                          </div>
                        </td>
                        <td className="text-center p-3">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeView === "findings" && (
            <div className="space-y-6">
              <h4 className="font-semibold">Audit Findings & Recommendations</h4>
              <div className="grid gap-4">
                {auditFindings.map((finding) => (
                  <div key={finding.id} className="p-6 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <AlertCircle className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{finding.customer}</h4>
                          <p className="text-sm text-muted-foreground">{finding.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={finding.severity === "High" ? "destructive" : finding.severity === "Medium" ? "secondary" : "default"}>
                          {finding.severity}
                        </Badge>
                        <Badge variant={finding.status === "Resolved" ? "default" : "outline"}>
                          {finding.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">{finding.description}</p>
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-sm font-medium mb-1">Recommendation:</p>
                        <p className="text-sm">{finding.recommendation}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Due: {finding.dueDate}</span>
                        <span>Assigned: {finding.assignedTo}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" />
                          Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Update
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === "compliance" && (
            <div className="space-y-6">
              <h4 className="font-semibold">Compliance Metrics & Standards</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium mb-4">Compliance by Category</h5>
                  <div className="space-y-3">
                    {complianceMetrics.map((metric, index) => (
                      <div key={index} className="p-4 rounded-lg bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{metric.category}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">{metric.score}%</span>
                            <Badge variant={metric.status === "Excellent" ? "default" : "secondary"}>
                              {metric.status}
                            </Badge>
                          </div>
                        </div>
                        <Progress value={metric.score} className="h-2" />
                        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                          <span>{metric.issues} issues found</span>
                          <span>Target: 95%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium mb-4">Compliance Trends</h5>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={auditTrends}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} />
                        <Line type="monotone" dataKey="issues" stroke="#ef4444" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === "reports" && (
            <div className="space-y-6">
              <h4 className="font-semibold">Audit Reports & Opinions</h4>
              <div className="grid gap-4">
                {auditReports.map((report) => (
                  <div key={report.id} className="p-6 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{report.customer} - {report.period}</h4>
                          <p className="text-sm text-muted-foreground">Report ID: {report.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          report.opinion === "Unqualified" ? "default" : 
                          report.opinion === "Qualified" ? "secondary" : 
                          report.opinion === "Adverse" ? "destructive" : "outline"
                        }>
                          {report.opinion}
                        </Badge>
                        <Badge variant={report.status === "Completed" ? "default" : "outline"}>
                          {report.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground">Auditor</p>
                        <p className="font-semibold text-sm">{report.auditor}</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground">Materiality</p>
                        <p className="font-semibold text-sm">${report.materiality.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground">Findings</p>
                        <p className="font-semibold text-sm">{report.findings}</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground">Recommendations</p>
                        <p className="font-semibold text-sm">{report.recommendations}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Key Audit Matters:</p>
                      <div className="flex flex-wrap gap-2">
                        {report.keyMatters.map((matter, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {matter}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Completed: {report.date}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" />
                          View Report
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === "engagement" && (
            <div className="space-y-6">
              <h4 className="font-semibold">Engagement Management & Working Papers</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium mb-4">Active Engagements</h5>
                  <div className="space-y-3">
                    {engagementLetters.map((engagement) => (
                      <div key={engagement.id} className="p-4 rounded-lg bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{engagement.customer}</span>
                          <Badge variant="default">{engagement.status}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Scope</p>
                            <p className="font-semibold">{engagement.scope}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Fee</p>
                            <p className="font-semibold">${engagement.fee.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">
                            Period: {engagement.startDate} - {engagement.endDate}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium mb-4">Audit Working Papers</h5>
                  <div className="space-y-4">
                    {auditWorkingPapers.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="p-4 rounded-lg bg-muted/30">
                        <h6 className="font-medium mb-3 text-sm">{section.section}</h6>
                        <div className="space-y-2">
                          {section.papers.map((paper, paperIndex) => (
                            <div key={paperIndex} className="flex items-center justify-between text-xs">
                              <span className="flex-1">{paper.name}</span>
                              <div className="flex items-center gap-2">
                                <Badge variant={paper.status === "Complete" ? "default" : "outline"} className="text-xs">
                                  {paper.status}
                                </Badge>
                                <span className="text-muted-foreground">{paper.reviewer}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Audit Alerts */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
              <XCircle className="w-4 h-4 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200">Critical Audit Alert</p>
                <p className="text-xs text-red-700 dark:text-red-300">
                  StartupXYZ shows negative profit margin for 3 consecutive months. Immediate financial review required.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Pending Audits</p>
                <p className="text-lg font-semibold">{auditMetrics.pendingAudits}</p>
                <Badge variant="secondary" className="mt-1">
                  Due this week
                </Badge>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Resolved Issues</p>
                <p className="text-lg font-semibold">{auditMetrics.resolvedIssues}</p>
                <Badge variant="secondary" className="mt-1">
                  This month
                </Badge>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Avg Risk Score</p>
                <p className="text-lg font-semibold">{auditMetrics.averageRiskScore}</p>
                <Badge variant="secondary" className="mt-1">
                  Out of 100
                </Badge>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Audit Efficiency</p>
                <p className="text-lg font-semibold">92%</p>
                <Badge variant="secondary" className="mt-1">
                  On-time completion
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Audit Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Audit Alerts & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="font-medium text-red-800 dark:text-red-200">High Priority</span>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300">
                StartupXYZ requires immediate financial intervention. Negative cash flow detected for 3 months.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-yellow-800 dark:text-yellow-200">Compliance Review</span>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                TechStart Inc has documentation gaps. Schedule follow-up audit within 2 weeks.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-200">Process Improvement</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Acme Corp shows excellent compliance. Consider using as best practice example.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Audit Health Score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">87/100</div>
              <p className="text-sm text-muted-foreground">Overall Audit Health</p>
              <Progress value={87} className="mt-2" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Compliance Rate</span>
                <Badge variant="secondary">Excellent</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Issue Resolution</span>
                <Badge variant="secondary">Good</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Audit Coverage</span>
                <Badge variant="secondary">Excellent</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Risk Management</span>
                <Badge variant="secondary">Good</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
