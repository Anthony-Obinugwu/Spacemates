'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { signupAction } from '@/app/actions/auth'

export default function Register() {
  const [state, formAction, isPending] = useActionState(signupAction, null)

  return (
    <main className="flex-1 flex items-center justify-center p-6 relative">
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-secondary/20 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="glass-panel p-8 rounded-3xl max-w-md w-full border border-border shadow-2xl relative z-10">
        <h1 className="text-4xl font-extrabold mb-2 text-center text-gradient">Join Spacemates</h1>
        <p className="text-muted text-center mb-8">Create your account to start matching</p>
        
        {state?.error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
            {state.error}
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-4">
          <input 
            type="text" 
            name="fullName" 
            placeholder="Full Name" 
            required
            className="p-4 rounded-xl bg-surface border border-border text-foreground outline-none focus:border-primary transition-colors" 
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Email Address" 
            required
            className="p-4 rounded-xl bg-surface border border-border text-foreground outline-none focus:border-primary transition-colors" 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            required
            className="p-4 rounded-xl bg-surface border border-border text-foreground outline-none focus:border-primary transition-colors" 
          />
          
          <button 
            type="submit" 
            disabled={isPending}
            className="p-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold transition-all transform hover:scale-[1.02] mt-4 shadow-[0_0_15px_rgba(99,102,241,0.3)] disabled:opacity-50"
          >
            {isPending ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <p className="mt-8 text-center text-muted">
          Already have an account? <Link href="/login" className="text-primary hover:underline font-medium">Log In</Link>
        </p>
      </div>
    </main>
  )
}
