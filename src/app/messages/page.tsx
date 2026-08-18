import { createClient } from '@/utils/supabase/server'
import { ChatRoom } from '@/components/ChatRoom'

export default async function MessagesDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const initialDemoMessages = [
    {
      id: 'demo-1',
      conversation_id: 'demo-conv-1',
      sender_id: 'other-user',
      content: 'Hey! I saw you applied for the 3-bed flat in Lekki.',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'demo-2',
      conversation_id: 'demo-conv-1',
      sender_id: 'other-user',
      content: 'Are you still looking for a roommate? My budget is ₦600k.',
      created_at: new Date(Date.now() - 1800000).toISOString(),
    },
  ]

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full p-0 sm:p-6 h-[calc(100vh-80px)] flex flex-col relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] pointer-events-none" />
      
      <div className="mb-6 px-6 sm:px-0">
        <h1 className="text-4xl font-extrabold mb-1 text-gradient">Messages</h1>
        <p className="text-muted">Coordinate with potential roommates and property agents via live WebSockets.</p>
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
            <button className="w-full p-3 rounded-2xl bg-primary/10 border border-primary/20 text-left flex items-center gap-3 transition-colors">
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center text-sm border-2 border-background font-bold relative">
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                JD
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold truncate text-foreground">John Doe</h3>
                  <span className="text-xs text-primary font-medium">Live</span>
                </div>
                <p className="text-sm text-foreground/80 truncate">Are you still looking for a roommate?</p>
              </div>
            </button>
          </div>
        </div>

        {/* Right Pane: Live WebSocket Chat Room */}
        <ChatRoom
          conversationId="demo-conv-1"
          initialMessages={initialDemoMessages}
          currentUserId={user?.id || 'current-user'}
          recipientName="John Doe"
          recipientId="john-doe-user-id"
        />

      </div>
    </main>
  )
}
