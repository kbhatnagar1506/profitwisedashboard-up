"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Download, 
  Upload, 
  Database, 
  Shield, 
  Clock, 
  CheckCircle,
  AlertCircle,
  FileText
} from "lucide-react"
import { usePersistence } from "@/hooks/use-persistence"

export function DataBackup() {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [lastBackup, setLastBackup] = useState<string | null>(null)
  const [dataSize, setDataSize] = useState<number>(0)
  
  const { exportData, importData } = usePersistence()

  const handleExport = async () => {
    setIsExporting(true)
    setExportStatus('idle')
    
    try {
      const exportResult = await exportData()
      setExportStatus('success')
      setLastBackup(new Date().toISOString())
      setDataSize(JSON.stringify(exportResult).length)
    } catch (error) {
      console.error('Export failed:', error)
      setExportStatus('error')
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setImportStatus('idle')
    
    try {
      await importData(file)
      setImportStatus('success')
    } catch (error) {
      console.error('Import failed:', error)
      setImportStatus('error')
    } finally {
      setIsImporting(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Backup & Recovery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Export Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Export Data</h3>
                <p className="text-sm text-muted-foreground">
                  Download a complete backup of your business data
                </p>
              </div>
              <Button 
                onClick={handleExport} 
                disabled={isExporting}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isExporting ? 'Exporting...' : 'Export Data'}
              </Button>
            </div>

            {exportStatus === 'success' && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-800">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm text-green-700 dark:text-green-300">
                  Data exported successfully! Download started.
                </span>
              </div>
            )}

            {exportStatus === 'error' && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-950 dark:border-red-800">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-sm text-red-700 dark:text-red-300">
                  Export failed. Please try again.
                </span>
              </div>
            )}
          </div>

          {/* Import Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Import Data</h3>
                <p className="text-sm text-muted-foreground">
                  Restore your data from a previous backup
                </p>
              </div>
              <div className="relative">
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  disabled={isImporting}
                  className="hidden"
                  id="import-file"
                />
                <Button
                  asChild
                  variant="outline"
                  disabled={isImporting}
                  className="flex items-center gap-2"
                >
                  <label htmlFor="import-file">
                    <Upload className="w-4 h-4" />
                    {isImporting ? 'Importing...' : 'Import Data'}
                  </label>
                </Button>
              </div>
            </div>

            {importStatus === 'success' && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-800">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm text-green-700 dark:text-green-300">
                  Data imported successfully! Page will reload.
                </span>
              </div>
            )}

            {importStatus === 'error' && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-950 dark:border-red-800">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-sm text-red-700 dark:text-red-300">
                  Import failed. Please check the file format.
                </span>
              </div>
            )}
          </div>

          {/* Backup Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Backup Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Last Backup</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {lastBackup ? new Date(lastBackup).toLocaleString() : 'Never'}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Data Size</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {dataSize > 0 ? formatFileSize(dataSize) : 'Unknown'}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Security</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Encrypted
                </Badge>
              </div>
            </div>
          </div>

          {/* Auto Backup Status */}
          <div className="space-y-4">
            <h3 className="font-semibold">Automatic Backup</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto-save enabled</span>
                <Badge variant="default" className="text-xs">
                  Active
                </Badge>
              </div>
              <Progress value={100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Your data is automatically saved every time you make changes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
