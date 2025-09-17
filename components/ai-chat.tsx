"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Copy, ThumbsUp, ThumbsDown, RotateCcw, Send, Plus } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI business advisor. I can help you analyze your performance metrics, identify growth opportunities, and provide strategic recommendations. What would you like to explore today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [input])

  const businessResponses = [
    "Based on your current metrics, I notice your customer acquisition cost has improved by 15% this month. Your conversion rate of 3.2% is above industry average. I recommend focusing on your top-performing channels to maximize ROI.",
    "Your revenue growth shows a strong upward trend. The 23% month-over-month increase suggests your recent marketing campaigns are effective. Consider scaling your successful strategies while monitoring customer lifetime value.",
    "I see some interesting patterns in your customer data. Your retention rate of 93% is excellent, but there's opportunity to increase average order value. Would you like me to suggest some upselling strategies?",
    "Your cash flow analysis indicates healthy liquidity. The 2.1x current ratio shows good short-term financial stability. I recommend maintaining 3-6 months of operating expenses in reserves for optimal financial health.",
    "Looking at your social media analytics, engagement rates have increased 45% this quarter. Your content strategy is resonating well with your audience. Consider expanding to similar platforms to reach new customers.",
  ]

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    setTimeout(
      () => {
        const assistantMessage: Message = {
          role: "assistant",
          content: businessResponses[Math.floor(Math.random() * businessResponses.length)],
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
        setIsTyping(false)
      },
      1500 + Math.random() * 1000,
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const regenerateResponse = () => {
    if (messages.length > 1) {
      const lastUserMessage = messages[messages.length - 2]
      if (lastUserMessage.role === "user") {
        setMessages((prev) => prev.slice(0, -1))
        setIsTyping(true)

        setTimeout(() => {
          const newResponse: Message = {
            role: "assistant",
            content: businessResponses[Math.floor(Math.random() * businessResponses.length)],
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, newResponse])
          setIsTyping(false)
        }, 1500)
      }
    }
  }

  const startNewChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! I'm your AI business advisor. I can help you analyze your performance metrics, identify growth opportunities, and provide strategic recommendations. What would you like to explore today?",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-background">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8 bg-green-600">
            <AvatarFallback className="bg-green-600 text-white text-sm">AI</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-foreground">Business AI Assistant</h2>
            <p className="text-sm text-muted-foreground">Powered by advanced AI</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={startNewChat} className="gap-2 bg-transparent">
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.map((message, index) => (
            <div key={index} className="group mb-8">
              <div className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                {message.role === "assistant" && (
                  <Avatar className="w-8 h-8 bg-green-600 flex-shrink-0">
                    <AvatarFallback className="bg-green-600 text-white text-sm">AI</AvatarFallback>
                  </Avatar>
                )}

                <div className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"} max-w-[80%]`}>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === "user" ? "bg-blue-600 text-white" : "bg-muted border border-border"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {message.role === "assistant" && (
                    <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-muted"
                        onClick={() => copyMessage(message.content)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
                        <ThumbsUp className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
                        <ThumbsDown className="w-3 h-3" />
                      </Button>
                      {index === messages.length - 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-muted"
                          onClick={regenerateResponse}
                        >
                          <RotateCcw className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {message.role === "user" && (
                  <Avatar className="w-8 h-8 bg-blue-600 flex-shrink-0">
                    <AvatarFallback className="bg-blue-600 text-white text-sm">You</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4 mb-8">
              <Avatar className="w-8 h-8 bg-green-600">
                <AvatarFallback className="bg-green-600 text-white text-sm">AI</AvatarFallback>
              </Avatar>
              <div className="bg-muted border border-border rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-border bg-background">
        <div className="max-w-4xl mx-auto p-4">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your business metrics, growth strategies, or performance insights..."
              className="min-h-[52px] max-h-[200px] pr-12 resize-none border-border focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              disabled={isTyping}
            />
            <Button
              onClick={handleSend}
              size="sm"
              className="absolute right-2 bottom-2 h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700"
              disabled={!input.trim() || isTyping}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            AI can make mistakes. Verify important business decisions.
          </p>
        </div>
      </div>
    </div>
  )
}
