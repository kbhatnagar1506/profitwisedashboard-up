"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  Download, 
  Eye, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Calendar,
  User,
  Building,
  DollarSign
} from "lucide-react"

interface AuditReportTemplateProps {
  reportId: string
  customer: string
  period: string
  opinion: "Unqualified" | "Qualified" | "Adverse" | "Disclaimer"
  auditor: string
  date: string
  materiality: number
  keyMatters: string[]
  findings: number
  recommendations: number
}

export function AuditReportTemplate({
  reportId,
  customer,
  period,
  opinion,
  auditor,
  date,
  materiality,
  keyMatters,
  findings,
  recommendations
}: AuditReportTemplateProps) {
  const getOpinionColor = (opinion: string) => {
    switch (opinion) {
      case "Unqualified": return "text-green-600"
      case "Qualified": return "text-yellow-600"
      case "Adverse": return "text-red-600"
      case "Disclaimer": return "text-gray-600"
      default: return "text-gray-600"
    }
  }

  const getOpinionIcon = (opinion: string) => {
    switch (opinion) {
      case "Unqualified": return <CheckCircle className="w-5 h-5 text-green-600" />
      case "Qualified": return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case "Adverse": return <XCircle className="w-5 h-5 text-red-600" />
      case "Disclaimer": return <AlertTriangle className="w-5 h-5 text-gray-600" />
      default: return <AlertTriangle className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Report Header */}
      <Card>
        <CardHeader className="text-center border-b">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Building className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Independent Auditor's Report</h1>
              <p className="text-muted-foreground">Financial Statements Audit</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Report ID: {reportId}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>Auditor: {auditor}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span>Materiality: ${materiality.toLocaleString()}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Addressee */}
          <div>
            <h2 className="text-lg font-semibold mb-2">To the Shareholders and Board of Directors of {customer}</h2>
            <p className="text-muted-foreground">
              We have audited the accompanying financial statements of {customer}, which comprise the balance sheet as at December 31, 2023, and the related statements of income, changes in equity, and cash flows for the year then ended, and notes to the financial statements, including a summary of significant accounting policies.
            </p>
          </div>

          {/* Opinion Section */}
          <div className="p-6 rounded-lg bg-muted/30 border-l-4 border-primary">
            <div className="flex items-center gap-3 mb-4">
              {getOpinionIcon(opinion)}
              <h3 className="text-xl font-semibold">Opinion</h3>
            </div>
            <p className={`text-lg font-medium ${getOpinionColor(opinion)}`}>
              {opinion === "Unqualified" && 
                "In our opinion, the financial statements present fairly, in all material respects, the financial position of " + customer + " as at December 31, 2023, and its financial performance and cash flows for the year then ended in accordance with International Financial Reporting Standards (IFRS)."
              }
              {opinion === "Qualified" && 
                "In our opinion, except for the effects of the matter described in the Basis for Qualified Opinion section of our report, the financial statements present fairly, in all material respects, the financial position of " + customer + " as at December 31, 2023, and its financial performance and cash flows for the year then ended in accordance with International Financial Reporting Standards (IFRS)."
              }
              {opinion === "Adverse" && 
                "In our opinion, because of the significance of the matter discussed in the Basis for Adverse Opinion section of our report, the financial statements do not present fairly the financial position of " + customer + " as at December 31, 2023, and its financial performance and cash flows for the year then ended in accordance with International Financial Reporting Standards (IFRS)."
              }
              {opinion === "Disclaimer" && 
                "We do not express an opinion on the accompanying financial statements of " + customer + " because of the significance of the matter discussed in the Basis for Disclaimer of Opinion section of our report."
              }
            </p>
          </div>

          {/* Basis for Opinion */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Basis for Opinion</h3>
            <div className="space-y-3 text-sm">
              <p>
                We conducted our audit in accordance with International Standards on Auditing (ISAs). Our responsibilities under those standards are further described in the Auditor's Responsibilities for the Audit of the Financial Statements section of our report.
              </p>
              <p>
                We are independent of {customer} in accordance with the ethical requirements relevant to our audit of the financial statements, and we have fulfilled our other ethical responsibilities. We believe that the audit evidence we have obtained is sufficient and appropriate to provide a basis for our opinion.
              </p>
            </div>
          </div>

          {/* Key Audit Matters */}
          {keyMatters.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Key Audit Matters</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Key audit matters are those matters that, in our professional judgment, were of most significance in our audit of the financial statements of the current period. These matters were addressed in the context of our audit of the financial statements as a whole, and in forming our opinion thereon, and we do not provide a separate opinion on these matters.
              </p>
              <div className="space-y-2">
                {keyMatters.map((matter, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/30">
                    <h4 className="font-medium text-sm mb-1">{matter}</h4>
                    <p className="text-xs text-muted-foreground">
                      This matter was identified as a key audit matter due to its significance to the financial statements and the complexity of the related accounting estimates and judgments.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Responsibilities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Responsibilities of Management</h3>
              <div className="space-y-2 text-sm">
                <p>
                  Management is responsible for the preparation and fair presentation of these financial statements in accordance with IFRS, and for such internal control as management determines is necessary to enable the preparation of financial statements that are free from material misstatement, whether due to fraud or error.
                </p>
                <p>
                  In preparing the financial statements, management is responsible for assessing the company's ability to continue as a going concern, disclosing, as applicable, matters related to going concern and using the going concern basis of accounting unless management either intends to liquidate the company or to cease operations, or has no realistic alternative but to do so.
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Auditor's Responsibilities</h3>
              <div className="space-y-2 text-sm">
                <p>
                  Our objectives are to obtain reasonable assurance about whether the financial statements as a whole are free from material misstatement, whether due to fraud or error, and to issue an auditor's report that includes our opinion.
                </p>
                <p>
                  Reasonable assurance is a high level of assurance but is not a guarantee that an audit conducted in accordance with ISAs will always detect a material misstatement when it exists.
                </p>
              </div>
            </div>
          </div>

          {/* Audit Summary */}
          <div className="p-4 rounded-lg bg-muted/30">
            <h3 className="text-lg font-semibold mb-3">Audit Summary</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{findings}</p>
                <p className="text-sm text-muted-foreground">Findings</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{recommendations}</p>
                <p className="text-sm text-muted-foreground">Recommendations</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{keyMatters.length}</p>
                <p className="text-sm text-muted-foreground">Key Matters</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">100%</p>
                <p className="text-sm text-muted-foreground">Coverage</p>
              </div>
            </div>
          </div>

          {/* Signature */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="font-semibold">{auditor}</p>
                <p className="text-sm text-muted-foreground">Licensed Public Accountant</p>
                <p className="text-sm text-muted-foreground">ProfitWise Audit Firm</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Date: {date}</p>
                <p className="text-sm text-muted-foreground">Location: New York, NY</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button size="lg" className="gap-2">
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
        <Button size="lg" variant="outline" className="gap-2">
          <Eye className="w-4 h-4" />
          View Full Report
        </Button>
        <Button size="lg" variant="outline" className="gap-2">
          <FileText className="w-4 h-4" />
          Generate Management Letter
        </Button>
      </div>
    </div>
  )
}
