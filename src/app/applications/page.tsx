import Link from 'next/link';

export default function ApplicationsDashboard() {
  return (
    <main className="flex-1 max-w-6xl mx-auto w-full p-6 py-12 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 blur-[150px] pointer-events-none" />
      
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2 text-gradient">My Applications</h1>
        <p className="text-lg text-muted">Track your property applications, roommate groups, and escrow payments.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 relative z-10">
        
        {/* Application Card 1: Pending Acceptance */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-border shadow-lg flex flex-col md:flex-row gap-6 md:items-center">
          <div className="w-full md:w-48 h-32 bg-surface rounded-2xl relative overflow-hidden flex-shrink-0">
             <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />
             <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-xs font-bold border border-yellow-500/30">
               PENDING
             </div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">Private En-suite Bedroom</h2>
            <p className="text-muted text-sm mb-4">Lekki Phase 1, Lagos</p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-surface/50 px-4 py-2 rounded-xl border border-border">
                <span className="text-xs text-muted block mb-0.5">Rent</span>
                <span className="font-bold text-lg">₦1.2M</span>
              </div>
              <div className="bg-surface/50 px-4 py-2 rounded-xl border border-border">
                <span className="text-xs text-muted block mb-0.5">Compatibility</span>
                <span className="font-bold text-lg text-primary">92% Match</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 md:w-48">
            <button className="w-full py-3 rounded-xl bg-surface border border-border text-foreground font-semibold hover:bg-surface-hover transition-colors">
              Withdraw
            </button>
          </div>
        </div>

        {/* Application Card 2: Accepted -> Needs Escrow */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-border shadow-lg flex flex-col md:flex-row gap-6 md:items-center border-primary/30">
          <div className="w-full md:w-48 h-32 bg-surface rounded-2xl relative overflow-hidden flex-shrink-0">
             <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />
             <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30">
               ACCEPTED
             </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold">Shared Apartment with Gym</h2>
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-primary/20 text-primary border border-primary/30">Action Required</span>
            </div>
            <p className="text-muted text-sm mb-4">Yaba, Lagos</p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-surface/50 px-4 py-2 rounded-xl border border-border">
                <span className="text-xs text-muted block mb-0.5">Total Escrow Required</span>
                <span className="font-bold text-lg">₦850k</span>
              </div>
              <div className="bg-surface/50 px-4 py-2 rounded-xl border border-border flex -space-x-2 overflow-hidden">
                <div className="w-10 h-10 rounded-full border-2 border-background bg-zinc-700 flex items-center justify-center text-xs">Me</div>
                <div className="w-10 h-10 rounded-full border-2 border-background bg-zinc-800 flex items-center justify-center text-xs">J.</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 md:w-48">
            <button className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold transition-all transform hover:scale-[1.02] shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              Fund Escrow
            </button>
          </div>
        </div>

        {/* Application Card 3: Failed Group */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-red-500/20 shadow-lg flex flex-col md:flex-row gap-6 md:items-center opacity-70">
          <div className="w-full md:w-48 h-32 bg-surface rounded-2xl relative overflow-hidden flex-shrink-0 grayscale">
             <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />
             <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">
               FAILED
             </div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">2-Bed Flat (Co-renting)</h2>
            <p className="text-muted text-sm mb-4">Ikeja, Lagos</p>
            <p className="text-sm text-red-400">Your roommate group application failed because a member dropped out or failed to fund their escrow.</p>
          </div>
          <div className="flex flex-col gap-3 md:w-48">
            <button className="w-full py-3 rounded-xl bg-surface border border-border text-foreground font-semibold hover:bg-surface-hover transition-colors">
              Find New Group
            </button>
          </div>
        </div>

      </div>
    </main>
  )
}
