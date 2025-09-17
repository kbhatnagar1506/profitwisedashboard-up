"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Send, 
  Bot, 
  User, 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  RotateCcw,
  Sparkles,
  Loader2
} from "lucide-react"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isTyping?: boolean
}

const sampleMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Hello! I\'m your AI business assistant. I can help you analyze your business metrics, provide insights, and answer questions about your dashboard. What would you like to know?',
    timestamp: new Date(Date.now() - 300000)
  },
  {
    id: '2',
    role: 'user',
    content: 'Can you explain my current business health score?',
    timestamp: new Date(Date.now() - 240000)
  },
  {
    id: '3',
    role: 'assistant',
    content: 'Your business health score of 85% indicates strong overall performance! Here\'s the breakdown:\n\n• **Revenue Growth**: +12.5% month-over-month shows healthy expansion\n• **Customer Retention**: 94.2% is excellent and above industry average\n• **Profit Margin**: 26.7% indicates good operational efficiency\n• **Customer Acquisition**: 150 active customers with +8.2% growth\n\nThe main area to watch is the cash flow projection warning for Q3. I recommend reviewing your expense management and considering revenue diversification strategies.',
    timestamp: new Date(Date.now() - 180000)
  }
]

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>(sampleMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(input.trim()),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase()
    
    if (lowerInput.includes('health') || lowerInput.includes('score')) {
      return `Your business health score of 85% reflects strong performance across key metrics. The score is calculated based on:\n\n• Revenue growth trends\n• Customer retention rates\n• Profit margin stability\n• Cash flow management\n• Market position\n\nTo improve further, focus on the Q3 cash flow projection and consider diversifying revenue streams.`
    }
    
    if (lowerInput.includes('revenue') || lowerInput.includes('profit')) {
      return `Your financial metrics show positive trends:\n\n**Revenue**: $45,231/month (+12.5% growth)\n**Profit Margin**: 26.7% (industry average: 20-25%)\n**Monthly Profit**: ~$12,000\n\nRecommendations:\n• Consider reinvesting 30% of profits in growth initiatives\n• Monitor customer acquisition costs\n• Explore premium service tiers for higher margins`
    }
    
    if (lowerInput.includes('customer') || lowerInput.includes('retention')) {
      return `Customer metrics are excellent:\n\n**Active Customers**: 150 (+8.2% growth)\n**Retention Rate**: 94.2% (outstanding!)\n**Customer Segments**: Well-distributed across demographics\n\nYour retention rate is significantly above the 80-85% industry average. Consider implementing a customer success program to maintain this level while scaling.`
    }
    
    if (lowerInput.includes('alert') || lowerInput.includes('warning')) {
      return `You have 1 active alert:\n\n**Cash Flow Projection Warning**\n• Q3 shows potential shortage\n• Current runway: ~4 months\n• Recommended actions:\n  - Review recurring expenses\n  - Accelerate accounts receivable\n  - Consider short-term financing\n  - Optimize inventory management\n\nI can help you create a detailed action plan.`
    }
    
    return `I understand you're asking about "${userInput}". Based on your current business data, I can provide insights on:\n\n• Financial performance and trends\n• Customer analytics and retention\n• Growth opportunities\n• Risk assessment and alerts\n• Strategic recommendations\n\nCould you be more specific about which area you'd like me to analyze?`
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const regenerateResponse = (messageId: string) => {
    const messageIndex = messages.findIndex(m => m.id === messageId)
    if (messageIndex > 0) {
      const userMessage = messages[messageIndex - 1]
      if (userMessage.role === 'user') {
        setMessages(prev => prev.slice(0, messageIndex))
        setInput(userMessage.content)
      }
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          AI Business Assistant
          <Badge variant="secondary" className="ml-auto">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Online
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src="/ai-avatar.png" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-12'
                    : 'bg-muted mr-12'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
                
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => copyMessage(message.content)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => regenerateResponse(message.id)}
                    >
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <ThumbsUp className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <ThumbsDown className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
              
              {message.role === 'user' && (
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-2xl px-4 py-3 mr-12">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your business..."
              className="min-h-[44px] max-h-32 resize-none"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="sm"
              className="px-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </CardContent>
    </Card>
  )
}