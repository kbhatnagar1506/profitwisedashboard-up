import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Mic, RefreshCw, Download, MessageSquare, Settings } from "lucide-react"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Button variant="outline" className="flex flex-col gap-2 h-20 bg-transparent">
            <RefreshCw className="w-5 h-5" />
            <span className="text-xs">Update Info</span>
          </Button>
          <Button variant="outline" className="flex flex-col gap-2 h-20 bg-transparent">
            <Upload className="w-5 h-5" />
            <span className="text-xs">Upload Docs</span>
          </Button>
          <Button variant="outline" className="flex flex-col gap-2 h-20 bg-transparent">
            <Mic className="w-5 h-5" />
            <span className="text-xs">Voice Input</span>
          </Button>
          <Button variant="outline" className="flex flex-col gap-2 h-20 bg-transparent">
            <Download className="w-5 h-5" />
            <span className="text-xs">Export Data</span>
          </Button>
          <Button variant="outline" className="flex flex-col gap-2 h-20 bg-transparent">
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs">AI Chat</span>
          </Button>
          <Button variant="outline" className="flex flex-col gap-2 h-20 bg-transparent">
            <Settings className="w-5 h-5" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
