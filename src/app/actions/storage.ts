'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function savePropertyImagesAction(listingId: string, imageUrls: string[]) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('listings')
    .update({
      description: `Uploaded Photos: ${imageUrls.join(', ')}`,
      updated_at: new Date().toISOString(),
    })
    .eq('id', listingId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/list')
  return { success: true }
}

export async function submitKycDocumentAction(documentUrl: string, documentType: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('identity_verifications')
    .upsert({
      user_id: user.id,
      id_document_type: documentType,
      document_url: documentUrl,
      status: 'PENDING_VERIFICATION',
      submitted_at: new Date().toISOString(),
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/profile')
  return { success: true }
}
