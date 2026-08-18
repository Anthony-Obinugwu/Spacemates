import Link from 'next/link';

export default function MessagesDashboard() {
  return (
    <main className="flex-1 max-w-7xl mx-auto w-full p-0 sm:p-6 h-[calc(100vh-80px)] flex flex-col relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] pointer-events-none" />
      
      <div className="mb-6 px-6 sm:px-0">
        <h1 className="text-4xl font-extrabold mb-1 text-gradient">Messages</h1>
        <p className="text-muted">Coordinate with potential roommates and property agents.</p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden relative z-10 min-h-[500px]">
        
        {/* Left Pane: Conversations List */}
        <div className="w-full md:w-80 lg:w-96 glass-panel rounded-3xl border border-border flex flex-col overflow-hidden shadow-lg shrink-0">
          <div className="p-4 border-b border-border bg-surface/50 backdrop-blur-md">
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full bg-background/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {/* Active Conversation */}
            <button className="w-full p-3 rounded-2xl bg-primary/10 border border-primary/20 text-left flex items-center gap-3 transition-colors">
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center text-sm border-2 border-background font-bold relative">
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                JD
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold truncate text-foreground">John Doe</h3>
                  <span className="text-xs text-primary font-medium">Just now</span>
                </div>
                <p className="text-sm text-foreground/80 truncate">Hey! Are you still looking for a roommate for the Yaba flat?</p>
              </div>
            </button>

            {/* Inactive Conversation */}
            <button className="w-full p-3 rounded-2xl hover:bg-surface/50 border border-transparent text-left flex items-center gap-3 transition-colors">
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center text-sm border-2 border-background font-bold text-muted relative">
                SA
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold truncate text-muted-foreground">Sarah Agent</h3>
                  <span className="text-xs text-muted">Yesterday</span>
                </div>
                <p className="text-sm text-muted truncate">The landlord has approved your application.</p>
              </div>
            </button>
          </div>
        </div>

        {/* Right Pane: Active Chat View */}
        <div className="flex-1 glass-panel rounded-3xl border border-border flex flex-col overflow-hidden shadow-lg relative bg-surface/30">
          
          {/* Chat Header */}
          <div className="p-4 sm:p-6 border-b border-border bg-surface/80 backdrop-blur-md flex justify-between items-center z-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold">JD</div>
              <div>
                <h2 className="font-bold text-lg leading-tight">John Doe</h2>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Online
                </p>
              </div>
            </div>
            
            {/* Trust & Safety Report Button */}
            <button className="px-4 py-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
              Report
            </button>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 relative">
            
            {/* System Message */}
            <div className="flex justify-center my-2">
              <span className="text-xs px-3 py-1 bg-surface border border-border rounded-full text-muted">You matched with John Doe on Aug 18</span>
            </div>

            {/* Received Message */}
            <div className="flex items-end gap-2 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center text-xs">JD</div>
              <div className="bg-surface border border-border p-3 sm:p-4 rounded-2xl rounded-bl-sm text-sm">
                <p>Hey! I saw you applied for the 3-bed flat in Lekki.</p>
                <span className="text-[10px] text-muted block mt-2">10:42 AM</span>
              </div>
            </div>

            {/* Received Message */}
            <div className="flex items-end gap-2 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center text-xs opacity-0">JD</div>
              <div className="bg-surface border border-border p-3 sm:p-4 rounded-2xl rounded-tl-sm rounded-bl-sm text-sm">
                <p>Are you still looking for a roommate? My budget is ₦600k.</p>
                <span className="text-[10px] text-muted block mt-2">10:43 AM</span>
              </div>
            </div>

            {/* Sent Message */}
            <div className="flex items-end gap-2 max-w-[80%] ml-auto justify-end">
              <div className="bg-primary/20 border border-primary/30 p-3 sm:p-4 rounded-2xl rounded-br-sm text-sm text-foreground">
                <p>Hi John! Yes I am. I checked your profile and we have a 95% compatibility score! 🎉</p>
                <span className="text-[10px] text-primary/80 block mt-2 text-right">Just now &middot; Read</span>
              </div>
            </div>

          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-border bg-surface/80 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <button className="p-3 rounded-full hover:bg-background/50 text-muted transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
              </button>
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="flex-1 bg-background/50 border border-border rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <button className="p-3 rounded-full bg-primary hover:bg-primary-hover text-white transition-colors shadow-lg shadow-primary/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
