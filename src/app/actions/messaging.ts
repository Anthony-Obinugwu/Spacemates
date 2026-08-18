'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function sendMessageAction(conversationId: string, content: string) {
  if (!content || !content.trim()) {
    return { error: 'Message content cannot be empty' }
  }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: content.trim(),
      created_at: new Date().toISOString(),
    })
    .select()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/messages')
  return { success: true, message: data?.[0] }
}

export async function createReportAction(targetType: 'USER' | 'LISTING' | 'MESSAGE', targetId: string, reason: string) {
  if (!reason || !reason.trim()) {
    return { error: 'Reason is required for submitting a report' }
  }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('reports')
    .insert({
      reporter_id: user.id,
      target_type: targetType,
      target_id: targetId,
      reason: reason.trim(),
      status: 'PENDING_REVIEW',
      created_at: new Date().toISOString(),
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/reports')
  return { success: true }
}

export async function getConversationsAction() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: participants } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('user_id', user.id)

  if (!participants || participants.length === 0) return []

  const conversationIds = participants.map(p => p.conversation_id)

  const { data: conversations } = await supabase
    .from('conversations')
    .select('*, conversation_participants(user_id, profiles(full_name, email)), messages(content, created_at)')
    .in('id', conversationIds)

  return conversations || []
}

export async function getMessagesAction(conversationId: string) {
  const supabase = await createClient()

  const { data: messages } = await supabase
    .from('messages')
    .select('*, profiles(full_name)')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  return messages || []
}
