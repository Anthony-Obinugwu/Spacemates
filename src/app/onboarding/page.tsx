export default function Onboarding() {
  return (
    <main className="flex-1 flex flex-col items-center py-12 p-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 blur-[100px] pointer-events-none" />
      
      <div className="glass-panel p-8 sm:p-12 rounded-3xl max-w-3xl w-full border border-border shadow-2xl relative z-10">
        <h1 className="text-4xl font-bold mb-2 text-gradient">Complete Your Profile</h1>
        <p className="text-muted mb-8 text-lg">Tell us about yourself so we can find your ideal roommates.</p>

        <form className="flex flex-col gap-8">
          <section>
            <h2 className="text-2xl font-semibold mb-6 border-b border-border pb-3">Basic Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted">Display Name</label>
                <input type="text" placeholder="e.g. Alex" className="p-4 rounded-xl bg-surface border border-border outline-none focus:border-primary transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted">Date of Birth</label>
                <input type="date" className="p-4 rounded-xl bg-surface border border-border outline-none focus:border-primary transition-colors text-muted" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted">City</label>
                <input type="text" placeholder="e.g. Lagos" className="p-4 rounded-xl bg-surface border border-border outline-none focus:border-primary transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted">Occupation</label>
                <input type="text" placeholder="e.g. Designer" className="p-4 rounded-xl bg-surface border border-border outline-none focus:border-primary transition-colors" />
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-5">
              <label className="text-sm font-medium text-muted">Bio</label>
              <textarea placeholder="A short bio about yourself..." className="p-4 rounded-xl bg-surface border border-border outline-none focus:border-primary transition-colors w-full h-32 resize-none"></textarea>
            </div>
          </section>

          <section className="mt-4">
            <h2 className="text-2xl font-semibold mb-6 border-b border-border pb-3">Lifestyle Preferences</h2>
            
            <div className="flex flex-col gap-6">
              <div className="bg-surface/40 p-6 rounded-2xl border border-border">
                <label className="block font-medium mb-3 text-lg">How clean do you keep your living space?</label>
                <select className="w-full p-4 rounded-xl bg-surface border border-border appearance-none outline-none focus:border-primary transition-colors">
                  <option>Very clean and organized</option>
                  <option>Average cleanliness</option>
                  <option>A bit messy but manageable</option>
                </select>
              </div>

              <div className="bg-surface/40 p-6 rounded-2xl border border-border">
                <label className="block font-medium mb-3 text-lg">Do you have or are you okay with pets?</label>
                <select className="w-full p-4 rounded-xl bg-surface border border-border appearance-none outline-none focus:border-primary transition-colors">
                  <option>I have pets</option>
                  <option>I don't have pets but I'm okay with them</option>
                  <option>No pets allowed / Allergic</option>
                </select>
                <div className="mt-4 flex items-center gap-3 bg-surface p-3 rounded-lg border border-border/50">
                  <input type="checkbox" id="dealbreaker1" className="w-5 h-5 accent-primary rounded cursor-pointer" />
                  <label htmlFor="dealbreaker1" className="text-sm font-medium cursor-pointer">Mark this as a Dealbreaker (Hard Filter)</label>
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-end mt-4">
            <button className="px-8 py-4 rounded-full bg-primary hover:bg-primary-hover text-white font-bold transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
              Save Profile & Continue
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
