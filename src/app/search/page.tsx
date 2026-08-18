import Link from 'next/link';

export default function Search() {
  return (
    <main className="flex-1 max-w-7xl mx-auto w-full p-6 py-12 relative flex flex-col h-[calc(100vh-80px)]">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gradient">Discover Listings</h1>
          <p className="text-muted mt-1">Find rooms and roommates that match your lifestyle.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <input type="text" placeholder="Search locations..." className="p-3 px-5 rounded-full bg-surface border border-border outline-none focus:border-primary flex-1 sm:w-64" />
          <button className="px-6 py-3 rounded-full bg-surface hover:bg-surface-hover border border-border font-medium transition-colors whitespace-nowrap">
            Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 min-h-0">
        
        {/* Sidebar Filters */}
        <div className="hidden lg:flex lg:col-span-1 flex-col gap-6 overflow-y-auto pr-4">
          <div className="glass-panel p-6 rounded-2xl border border-border">
            <h3 className="font-bold mb-4 border-b border-border pb-2">Listing Type</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                <span className="text-sm font-medium">Room Available</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-primary" />
                <span className="text-sm font-medium">Entire Property</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-primary" />
                <span className="text-sm font-medium">Co-renting Group</span>
              </label>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-border">
            <h3 className="font-bold mb-4 border-b border-border pb-2">Budget (NGN)</h3>
            <input type="range" className="w-full accent-primary" min="100000" max="5000000" />
            <div className="flex justify-between mt-2 text-xs text-muted font-mono">
              <span>₦100k</span>
              <span>₦5M+</span>
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <h3 className="font-bold mb-2 text-primary">Compatibility Mode</h3>
            <p className="text-xs text-muted mb-4">Results are currently sorted by your lifestyle compatibility score.</p>
            <button className="w-full py-2 rounded-xl bg-primary/20 text-primary font-bold border border-primary/30 text-sm hover:bg-primary hover:text-white transition-colors">
              Edit Preferences
            </button>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-12 content-start">
          
          {/* Mock Listing Card 1 */}
          <Link href="/search/1" className="glass-panel group rounded-3xl border border-border overflow-hidden flex flex-col hover:border-primary/50 transition-colors cursor-pointer shadow-lg">
            <div className="h-48 bg-surface relative w-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/10">
                92% Match
              </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg leading-tight line-clamp-1">Private En-suite Bedroom</h3>
              </div>
              <p className="text-sm text-muted mb-4 line-clamp-1">Lekki Phase 1, Lagos</p>
              
              <div className="mt-auto">
                <div className="flex items-end gap-1 mb-3">
                  <span className="text-2xl font-extrabold text-foreground">₦1.2M</span>
                  <span className="text-sm text-muted mb-1">/year</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs font-medium px-2 py-1 bg-surface border border-border rounded text-muted">Room</span>
                  <span className="text-xs font-medium px-2 py-1 bg-surface border border-border rounded text-muted">Private Bath</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Mock Listing Card 2 */}
          <Link href="/search/2" className="glass-panel group rounded-3xl border border-border overflow-hidden flex flex-col hover:border-primary/50 transition-colors cursor-pointer shadow-lg">
            <div className="h-48 bg-surface relative w-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/10">
                85% Match
              </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg leading-tight line-clamp-1">Shared Apartment with Gym</h3>
              </div>
              <p className="text-sm text-muted mb-4 line-clamp-1">Yaba, Lagos</p>
              
              <div className="mt-auto">
                <div className="flex items-end gap-1 mb-3">
                  <span className="text-2xl font-extrabold text-foreground">₦800k</span>
                  <span className="text-sm text-muted mb-1">/year</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs font-medium px-2 py-1 bg-surface border border-border rounded text-muted">Room</span>
                  <span className="text-xs font-medium px-2 py-1 bg-surface border border-border rounded text-muted">Shared Bath</span>
                </div>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </main>
  )
}
