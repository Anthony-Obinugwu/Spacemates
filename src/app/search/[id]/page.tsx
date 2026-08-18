import Link from 'next/link'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ListingDetail({ params }: PageProps) {
  const { id } = await params

  return (
    <main className="flex-1 max-w-6xl mx-auto w-full p-6 py-12 relative">
      <div className="mb-6">
        <Link href="/search" className="text-sm text-primary hover:underline inline-flex items-center gap-1 mb-4 font-medium">
          &larr; Back to Search
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gradient">Modern 3-Bedroom Apartment in Lekki Phase 1</h1>
            <p className="text-muted mt-1">Lekki Phase 1, Lagos &middot; Listing ID: {id}</p>
          </div>
          <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-bold text-sm flex items-center gap-2 self-start sm:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
            92% Lifestyle Match
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Left Column: Photo Gallery & Details */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Main Photo Gallery */}
          <div className="glass-panel p-3 rounded-3xl border border-border shadow-xl overflow-hidden">
            <div className="h-80 sm:h-96 rounded-2xl bg-surface relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />
              <div className="relative z-10 text-center p-6">
                <span className="text-4xl mb-2 block">🏡</span>
                <p className="text-lg font-bold text-foreground">Listing Photo Preview</p>
                <p className="text-xs text-muted mt-1">High-resolution verified photos</p>
              </div>
            </div>
          </div>

          {/* Compatibility Breakdown Card */}
          <div className="glass-panel p-8 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-surface/50 to-surface/80 shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-primary flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              PostgreSQL Compatibility RPC Breakdown
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-surface/60 p-4 rounded-2xl border border-border">
                <span className="text-xs text-muted block mb-1">Cleanliness Preference</span>
                <span className="font-semibold text-foreground text-sm">Very Clean & Organized ✓</span>
              </div>
              <div className="bg-surface/60 p-4 rounded-2xl border border-border">
                <span className="text-xs text-muted block mb-1">Sleep Schedule</span>
                <span className="font-semibold text-foreground text-sm">Early Bird ✓</span>
              </div>
              <div className="bg-surface/60 p-4 rounded-2xl border border-border">
                <span className="text-xs text-muted block mb-1">Guest Policy</span>
                <span className="font-semibold text-foreground text-sm">Occasional Guests ✓</span>
              </div>
              <div className="bg-surface/60 p-4 rounded-2xl border border-border">
                <span className="text-xs text-muted block mb-1">Dealbreaker Status</span>
                <span className="font-semibold text-green-400 text-sm">0 Dealbreakers Triggered ✓</span>
              </div>
            </div>
          </div>

          {/* Description & Amenities */}
          <div className="glass-panel p-8 rounded-3xl border border-border shadow-xl">
            <h2 className="text-xl font-bold mb-4 border-b border-border pb-3">About this space</h2>
            <p className="text-muted leading-relaxed text-sm mb-6">
              Spacious private en-suite bedroom in a luxury 3-bedroom flat in Lekki Phase 1. 
              The apartment features 24/7 power supply, high-speed fiber internet, fully equipped modern kitchen, and dedicated parking. Looking for a clean, respectful professional roommate.
            </p>

            <h3 className="font-semibold text-sm mb-3">Amenities & Features</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-medium">Private Bathroom</span>
              <span className="px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-medium">Fully Furnished</span>
              <span className="px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-medium">24/7 Power</span>
              <span className="px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-medium">Fiber Internet</span>
              <span className="px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-medium">Security Guard</span>
            </div>
          </div>

        </div>

        {/* Right Column: Pricing & Escrow Action Card */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-8 rounded-3xl border border-border sticky top-8 shadow-2xl flex flex-col gap-6">
            
            <div className="border-b border-border pb-4">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">Rent Breakdown</span>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-extrabold text-foreground">₦1,200,000</span>
                <span className="text-sm text-muted mb-1">/year</span>
              </div>
              <p className="text-xs text-muted mt-2">Flexible NGN Escrow terms available.</p>
            </div>

            {/* Host Info */}
            <div className="flex items-center gap-3 bg-surface/40 p-4 rounded-2xl border border-border">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 text-primary font-bold flex items-center justify-center text-sm">
                JD
              </div>
              <div>
                <h4 className="font-bold text-sm">John Doe</h4>
                <p className="text-xs text-muted">Host &middot; Product Manager</p>
              </div>
            </div>

            {/* Apply & Start Escrow Trigger */}
            <div className="flex flex-col gap-3">
              <Link 
                href="/applications"
                className="w-full py-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-center font-bold transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] transform hover:scale-[1.02]"
              >
                Apply & Start Escrow
              </Link>
              <Link
                href="/messages"
                className="w-full py-3 rounded-xl bg-surface border border-border text-foreground text-center font-semibold text-sm hover:bg-surface-hover transition-colors"
              >
                Message Host
              </Link>
            </div>

            <p className="text-[11px] text-muted text-center leading-relaxed">
              🔒 Funds are held safely in escrow until successful move-in and key delivery.
            </p>

          </div>
        </div>

      </div>
    </main>
  )
}
