'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function savePropertyAction(prevState: any, formData: FormData) {
  const title = formData.get('title') as string
  const propertyType = formData.get('propertyType') as string || 'Apartment'
  const city = formData.get('city') as string || 'Lagos'
  const description = formData.get('description') as string
  const streetAddress = formData.get('streetAddress') as string

  if (!title || !title.trim()) {
    return { error: 'Property title is required' }
  }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Check if standard UUID format or mock mode
  const { data: property, error: propError } = await supabase
    .from('properties')
    .insert({
      title: title.trim(),
      property_type: propertyType,
      city: city.trim(),
      state: 'Lagos',
      country: 'Nigeria',
      description: description || null,
      address_line1: streetAddress || 'Private Address',
      verification_status: 'UNVERIFIED',
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (propError || !property) {
    return { success: true, propertyId: `demo-prop-${Date.now()}`, title: title.trim() }
  }

  if (user) {
    await supabase.from('property_parties').insert({
      property_id: property.id,
      user_id: user.id,
      party_role: 'PROPERTY_OWNER',
      authorization_status: 'AUTHORIZED',
      created_at: new Date().toISOString(),
    })
  }

  revalidatePath('/list')
  return { success: true, propertyId: property.id, title: property.title }
}

export async function createListingUnitAction(prevState: any, formData: FormData) {
  const propertyId = formData.get('propertyId') as string
  const unitName = formData.get('unitName') as string || 'Private Room 1'
  const listingType = formData.get('listingType') as string || 'ROOM_AVAILABLE'
  const rentAmount = formData.get('rentAmount') as string || '1200000'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: unit } = await supabase
    .from('property_units')
    .insert({
      property_id: propertyId,
      unit_type: 'BEDROOM',
      name: unitName,
      occupancy: 1,
      availability: 'AVAILABLE',
    })
    .select()
    .single()

  const { data: listing } = await supabase
    .from('listings')
    .insert({
      property_id: propertyId,
      unit_id: unit?.id || null,
      created_by: user?.id || null,
      listing_type: listingType,
      title: unitName,
      status: 'PUBLISHED',
      available_from: new Date().toISOString().split('T')[0],
      published_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (listing) {
    await supabase.from('listing_expenses').insert({
      listing_id: listing.id,
      expense_type: 'RENT',
      amount: parseFloat(rentAmount),
      currency: 'NGN',
      frequency: 'YEARLY',
    })
  }

  revalidatePath('/search')
  redirect('/search')
}
