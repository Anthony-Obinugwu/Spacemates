import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <main className="flex-1 max-w-7xl mx-auto w-full p-6 py-12 relative">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-500/10 blur-[150px] pointer-events-none" />
      
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold mb-2 text-gradient">Admin Dashboard</h1>
          <p className="text-lg text-muted">Platform metrics and Trust & Safety overview.</p>
        </div>
        <Link href="/admin/reports" className="px-6 py-3 rounded-xl bg-red-500/10 text-red-400 font-bold hover:bg-red-500/20 transition-colors border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)] flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          Review Reports
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        
        {/* Metric Card */}
        <div className="glass-panel p-6 rounded-3xl border border-border flex flex-col gap-2 relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <span className="text-muted text-sm font-medium">Active Users</span>
          <span className="text-4xl font-bold">1,248</span>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/5 blur-2xl group-hover:bg-primary/20 transition-colors"></div>
        </div>

        {/* Metric Card */}
        <div className="glass-panel p-6 rounded-3xl border border-border flex flex-col gap-2 relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
          </div>
          <span className="text-muted text-sm font-medium">Active Listings</span>
          <span className="text-4xl font-bold">342</span>
        </div>

        {/* Metric Card */}
        <div className="glass-panel p-6 rounded-3xl border border-border flex flex-col gap-2 relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
          <span className="text-muted text-sm font-medium">Total Applications</span>
          <span className="text-4xl font-bold">8,932</span>
        </div>

        {/* Metric Card - Negative */}
        <div className="glass-panel p-6 rounded-3xl border border-red-500/30 bg-red-500/5 flex flex-col gap-2 relative overflow-hidden group">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <span className="text-red-400 text-sm font-medium">Pending Reports</span>
          <span className="text-4xl font-bold text-red-500">14</span>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-red-500/10 blur-2xl group-hover:bg-red-500/20 transition-colors"></div>
        </div>

        {/* Metric Card - Negative */}
        <div className="glass-panel p-6 rounded-3xl border border-border flex flex-col gap-2 relative overflow-hidden">
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-muted mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
          </div>
          <span className="text-muted text-sm font-medium">Suspended Users</span>
          <span className="text-4xl font-bold text-muted">2</span>
        </div>

      </div>
    </main>
  )
}
