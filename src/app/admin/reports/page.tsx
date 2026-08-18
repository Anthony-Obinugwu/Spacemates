import Link from 'next/link';

export default function AdminReports() {
  return (
    <main className="flex-1 max-w-6xl mx-auto w-full p-6 py-12 relative">
      <div className="mb-8">
        <Link href="/admin" className="text-sm text-primary hover:underline mb-4 inline-flex items-center gap-1">
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-4xl font-extrabold mb-2 text-gradient">Moderation Queue</h1>
        <p className="text-lg text-muted">Review Trust & Safety reports and take action on malicious users or listings.</p>
      </div>

      <div className="space-y-4 relative z-10">
        
        {/* Report Card */}
        <div className="glass-panel p-6 rounded-2xl border border-red-500/30 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center bg-red-500/5">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">PENDING_REVIEW</span>
              <span className="text-muted text-sm">Target: USER (John Doe)</span>
            </div>
            <p className="text-foreground font-medium mb-1">"User is asking for deposit outside of the Spacemates platform."</p>
            <p className="text-sm text-muted">Reported by Sarah Smith &middot; 2 hours ago</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-surface border border-border text-foreground font-semibold hover:bg-surface-hover transition-colors text-sm">
              Dismiss
            </button>
            <button className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors shadow-lg shadow-red-500/20 text-sm">
              Suspend User
            </button>
          </div>
        </div>

        {/* Report Card */}
        <div className="glass-panel p-6 rounded-2xl border border-border flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-1 rounded bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20">RESOLVED</span>
              <span className="text-muted text-sm">Target: LISTING (Lekki Flat)</span>
            </div>
            <p className="text-foreground font-medium mb-1">"Listing photos are fake."</p>
            <p className="text-sm text-muted">Reported by Mike Jones &middot; Yesterday</p>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-sm text-muted">Action Taken: Listing Suspended</span>
          </div>
        </div>

      </div>
    </main>
  )
}
