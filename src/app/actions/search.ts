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

  // Fetch host identity verification status & compatibility score
  const listingsWithMetadata = await Promise.all(
    filteredListings.map(async (listing) => {
      let isVerifiedHost = false
      let compatibilityScore = 85

      if (listing.created_by) {
        const { data: kyc } = await supabase
          .from('identity_verifications')
          .select('status')
          .eq('user_id', listing.created_by)
          .eq('status', 'VERIFIED')
          .maybeSingle()

        if (kyc) isVerifiedHost = true

        if (user) {
          const { data: score } = await supabase.rpc('calculate_compatibility_score', {
            user_a_id: user.id,
            user_b_id: listing.created_by,
          })
          if (typeof score === 'number') compatibilityScore = score
        }
      }

      return {
        ...listing,
        compatibilityScore,
        isVerifiedHost,
      }
    })
  )

  return listingsWithMetadata.sort((a, b) => (b.compatibilityScore || 0) - (a.compatibilityScore || 0))
}
