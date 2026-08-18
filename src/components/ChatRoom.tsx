'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { sendMessageAction, createReportAction } from '@/app/actions/messaging'

interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
  profiles?: { full_name?: string; display_name?: string }
}

interface ChatRoomProps {
  conversationId: string
  initialMessages: Message[]
  currentUserId: string
  recipientName: string
  recipientId: string
}

export function ChatRoom({
  conversationId,
  initialMessages,
  currentUserId,
  recipientName,
  recipientId,
}: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputText, setInputText] = useState('')
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [isSubmittingReport, setIsSubmittingReport] = useState(false)
  const [reportSuccess, setReportSuccess] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Supabase Realtime WebSocket Subscription
  useEffect(() => {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(conversationId)
    if (!isUUID) return // Skip WebSocket channel for demo conversation IDs

    const channel = supabase
      .channel(`chat_room:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, supabase])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const tempId = `temp-${Date.now()}`
    const tempMsg: Message = {
      id: tempId,
      conversation_id: conversationId,
      sender_id: currentUserId,
      content: inputText.trim(),
      created_at: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, tempMsg])
    const sentText = inputText
    setInputText('')

    const res = await sendMessageAction(conversationId, sentText)
    if (res?.error) {
      setMessages((prev) => prev.filter((m) => m.id !== tempId))
    } else if (res?.message) {
      setMessages((prev) => prev.map((m) => (m.id === tempId ? (res.message as Message) : m)))
    }
  }

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reportReason.trim()) return
    setIsSubmittingReport(true)

    const res = await createReportAction('USER', recipientId, reportReason)
    setIsSubmittingReport(false)

    if (res.success) {
      setReportSuccess(true)
      setTimeout(() => {
        setShowReportModal(false)
        setReportSuccess(false)
        setReportReason('')
      }, 2000)
    }
  }

  return (
    <div className="flex-1 glass-panel rounded-3xl border border-border flex flex-col overflow-hidden shadow-lg relative bg-surface/30">
      
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-border bg-surface/80 backdrop-blur-md flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-primary">
            {recipientName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">{recipientName}</h2>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Connected
            </p>
          </div>
        </div>

        {/* Report Button */}
        <button
          onClick={() => setShowReportModal(true)}
          className="px-4 py-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors flex items-center gap-2 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
          Report User
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 relative">
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUserId || msg.sender_id === 'current-user'
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 max-w-[80%] ${isMe ? 'ml-auto justify-end' : ''}`}
            >
              {!isMe && (
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center text-xs font-bold">
                  {recipientName.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div
                className={`p-3 sm:p-4 rounded-2xl text-sm ${
                  isMe
                    ? 'bg-primary/20 border border-primary/30 rounded-br-sm text-foreground'
                    : 'bg-surface border border-border rounded-bl-sm text-foreground'
                }`}
              >
                <p>{msg.content}</p>
                <span className={`text-[10px] block mt-2 ${isMe ? 'text-primary/80 text-right' : 'text-muted'}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-border bg-surface/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-background/50 border border-border rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <button
            type="submit"
            className="p-3 rounded-full bg-primary hover:bg-primary-hover text-white transition-colors shadow-lg shadow-primary/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
      </form>

      {/* Trust & Safety Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl max-w-md w-full border border-red-500/30 bg-surface/90 shadow-2xl">
            <h3 className="text-xl font-bold text-gradient mb-2">Report User</h3>
            <p className="text-sm text-muted mb-4">Reports are submitted directly to platform admins for review.</p>

            {reportSuccess ? (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm text-center font-bold">
                ✓ Report submitted to Admin queue.
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="flex flex-col gap-4">
                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Explain why you are reporting this user (e.g. asking for offline deposit, fake listing)..."
                  required
                  className="p-4 rounded-xl bg-background/50 border border-border text-sm outline-none focus:border-red-500 h-28 resize-none"
                />
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 rounded-xl bg-surface border border-border text-sm hover:bg-surface-hover transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReport}
                    className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors shadow-lg shadow-red-500/20 disabled:opacity-50"
                  >
                    {isSubmittingReport ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
