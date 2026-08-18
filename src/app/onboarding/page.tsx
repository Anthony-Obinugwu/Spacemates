'use client'

import { useActionState } from 'react'
import { saveOnboardingAction } from '@/app/actions/profile'

export default function Onboarding() {
  const [state, formAction, isPending] = useActionState(saveOnboardingAction, null)

  return (
    <main className="flex-1 flex flex-col items-center py-12 p-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 blur-[100px] pointer-events-none" />
      
      <div className="glass-panel p-8 sm:p-12 rounded-3xl max-w-3xl w-full border border-border shadow-2xl relative z-10">
        <h1 className="text-4xl font-bold mb-2 text-gradient">Complete Your Profile</h1>
        <p className="text-muted mb-8 text-lg">Tell us about yourself so we can find your ideal roommates.</p>

        {state?.error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
            {state.error}
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-8">
          <section>
            <h2 className="text-2xl font-semibold mb-6 border-b border-border pb-3">Basic Information</h2>
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-sm font-medium text-muted">Short Bio</label>
              <textarea 
                name="bio"
                placeholder="Share a short bio about yourself, your hobbies, and what you are looking for in a roommate..." 
                className="p-4 rounded-xl bg-surface border border-border outline-none focus:border-primary transition-colors w-full h-32 resize-none"
              ></textarea>
            </div>
          </section>

          <section className="mt-2">
            <h2 className="text-2xl font-semibold mb-6 border-b border-border pb-3">Lifestyle Preferences</h2>
            
            <div className="flex flex-col gap-6">
              <div className="bg-surface/40 p-6 rounded-2xl border border-border">
                <label className="block font-medium mb-3 text-lg">How clean do you keep your living space?</label>
                <select name="cleanliness" className="w-full p-4 rounded-xl bg-surface border border-border appearance-none outline-none focus:border-primary transition-colors">
                  <option value="VERY_CLEAN">Very clean and organized</option>
                  <option value="AVERAGE">Average cleanliness</option>
                  <option value="MESSY">A bit messy but manageable</option>
                </select>
              </div>

              <div className="bg-surface/40 p-6 rounded-2xl border border-border">
                <label className="block font-medium mb-3 text-lg">What is your typical sleep schedule?</label>
                <select name="sleepSchedule" className="w-full p-4 rounded-xl bg-surface border border-border appearance-none outline-none focus:border-primary transition-colors">
                  <option value="EARLY_BIRD">Early Bird (Up before 7 AM)</option>
                  <option value="NIGHT_OWL">Night Owl (Late to bed)</option>
                  <option value="FLEXIBLE">Flexible / Standard hours</option>
                </select>
              </div>

              <div className="bg-surface/40 p-6 rounded-2xl border border-border">
                <label className="block font-medium mb-3 text-lg">Do you have or are you okay with pets?</label>
                <select name="pets" className="w-full p-4 rounded-xl bg-surface border border-border appearance-none outline-none focus:border-primary transition-colors">
                  <option value="HAVE_PETS">I have pets</option>
                  <option value="PETS_OKAY">I don't have pets but I'm okay with them</option>
                  <option value="NO_PETS">No pets allowed / Allergic</option>
                </select>
              </div>

              <div className="bg-surface/40 p-6 rounded-2xl border border-border">
                <label className="block font-medium mb-3 text-lg">Guest Policy Preference</label>
                <select name="guests" className="w-full p-4 rounded-xl bg-surface border border-border appearance-none outline-none focus:border-primary transition-colors">
                  <option value="GUESTS_OKAY">Frequent guests welcome</option>
                  <option value="OCCASIONAL">Occasional guests with notice</option>
                  <option value="NO_GUESTS">No overnight guests</option>
                </select>
              </div>
            </div>
          </section>

          <div className="flex justify-end mt-4">
            <button 
              type="submit" 
              disabled={isPending}
              className="px-8 py-4 rounded-full bg-primary hover:bg-primary-hover text-white font-bold transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-50"
            >
              {isPending ? 'Saving Preferences...' : 'Save Profile & Continue'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
