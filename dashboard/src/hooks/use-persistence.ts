"use client"

import { useEffect, useCallback, useRef } from 'react'
import { dataService } from '@/lib/data-service'

interface PersistenceState {
  activeSection: string
  userPreferences: Record<string, any>
  viewedSections: string[]
  interactions: any[]
  bookmarks: any[]
  notes: Record<string, string>
  filters: Record<string, any>
  settings: Record<string, any>
}

export function usePersistence() {
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedState = useRef<string>('')

  const saveState = useCallback(async (state: Partial<PersistenceState>) => {
    try {
      const stateString = JSON.stringify(state)
      
      // Only save if state has changed
      if (stateString === lastSavedState.current) {
        return
      }

      lastSavedState.current = stateString
      
      await dataService.saveDashboardState({
        ...state,
        last_updated: new Date().toISOString()
      })
      
      console.log('Dashboard state saved successfully')
    } catch (error) {
      console.error('Failed to save dashboard state:', error)
    }
  }, [])

  const debouncedSave = useCallback((state: Partial<PersistenceState>) => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Set new timeout
    saveTimeoutRef.current = setTimeout(() => {
      saveState(state)
    }, 1000) // Save after 1 second of inactivity
  }, [saveState])

  const loadState = useCallback(async () => {
    try {
      const savedState = await dataService.getDashboardState()
      return savedState
    } catch (error) {
      console.error('Failed to load dashboard state:', error)
      return null
    }
  }, [])

  const exportData = useCallback(async () => {
    try {
      const exportData = await dataService.exportUserData()
      
      // Create download link
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `profitwise-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      return exportData
    } catch (error) {
      console.error('Failed to export data:', error)
      throw error
    }
  }, [])

  const importData = useCallback(async (file: File) => {
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      
      await dataService.importUserData(data)
      
      // Reload the page to reflect imported data
      window.location.reload()
      
      return data
    } catch (error) {
      console.error('Failed to import data:', error)
      throw error
    }
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  return {
    saveState,
    debouncedSave,
    loadState,
    exportData,
    importData
  }
}
