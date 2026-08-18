import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 text-center relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="glass-panel p-8 sm:p-16 rounded-3xl max-w-4xl relative z-10 border border-white/10 shadow-2xl">
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6">
          Find your perfect space.<br />
          <span className="text-gradient">Meet your ideal roommates.</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted mb-10 max-w-2xl mx-auto">
          Spacemates is the ultimate housing marketplace and compatibility engine.
          We match you with the right people and the right properties, securely.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/search"
            className="px-8 py-4 rounded-full bg-primary hover:bg-primary-hover text-white font-semibold transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
          >
            Find a Room
          </Link>
          <Link 
            href="/list"
            className="px-8 py-4 rounded-full bg-surface hover:bg-surface-hover border border-border text-white font-semibold transition-all transform hover:scale-105"
          >
            List a Property
          </Link>
        </div>
      </div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-secondary/30 blur-2xl rounded-full animate-float mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-accent/30 blur-2xl rounded-full animate-float mix-blend-screen" style={{ animationDelay: '2s' }} />
    </main>
  );
}
