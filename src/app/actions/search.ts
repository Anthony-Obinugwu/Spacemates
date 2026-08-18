'use server'

import { createClient } from '@/utils/supabase/server'

export async function getRankedListingsAction(filters?: { city?: string; listingType?: string }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Query active listings with public property data
  let query = supabase
    .from('listings')
    .select('*, public_properties(*), profiles:created_by(full_name)')
    .eq('status', 'PUBLISHED')

  if (filters?.listingType) {
    query = query.eq('listing_type', filters.listingType)
  }

  const { data: listings, error } = await query

  if (error || !listings) {
    return []
  }

  // Filter by city if provided
  let filteredListings = listings
  if (filters?.city) {
    filteredListings = filteredListings.filter(l => 
      l.public_properties?.city?.toLowerCase().includes(filters.city!.toLowerCase())
    )
  }

  // If user is logged in, calculate compatibility score for each listing's creator
  if (user) {
    const listingsWithScores = await Promise.all(
      filteredListings.map(async (listing) => {
        if (!listing.created_by) return { ...listing, compatibilityScore: 85 }

        const { data: score } = await supabase.rpc('calculate_compatibility_score', {
          user_a_id: user.id,
          user_b_id: listing.created_by,
        })

        return {
          ...listing,
          compatibilityScore: typeof score === 'number' ? score : 85,
        }
      })
    )

    // Rank descending by compatibility score
    return listingsWithScores.sort((a, b) => (b.compatibilityScore || 0) - (a.compatibilityScore || 0))
  }

  return filteredListings.map(l => ({ ...l, compatibilityScore: 85 }))
}
