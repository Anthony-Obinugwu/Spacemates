'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function saveOnboardingAction(prevState: any, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const cleanliness = formData.get('cleanliness') as string
  const sleepSchedule = formData.get('sleepSchedule') as string
  const pets = formData.get('pets') as string
  const guests = formData.get('guests') as string
  const bio = formData.get('bio') as string

  // Update profile status and bio
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      bio: bio || null,
      account_status: 'ACTIVE',
      profile_completion: 100,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (profileError) {
    return { error: profileError.message }
  }

  // Insert/Upsert User Preferences
  const preferencesToSave = [
    { question_code: 'CLEANLINESS', selected_option: cleanliness },
    { question_code: 'SLEEP_SCHEDULE', selected_option: sleepSchedule },
    { question_code: 'PETS', selected_option: pets },
    { question_code: 'GUESTS', selected_option: guests },
  ].filter(p => p.selected_option)

  for (const pref of preferencesToSave) {
    await supabase.from('user_preferences').upsert({
      user_id: user.id,
      question_code: pref.question_code,
      selected_option: pref.selected_option,
      updated_at: new Date().toISOString(),
    })
  }

  revalidatePath('/', 'layout')
  redirect('/search')
}
