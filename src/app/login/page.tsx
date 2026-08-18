'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { loginAction } from '@/app/actions/auth'

export default function Login() {
  const [state, formAction, isPending] = useActionState(loginAction, null)

  return (
    <main className="flex-1 flex items-center justify-center p-6 relative">
      <div className="glass-panel p-8 rounded-3xl max-w-md w-full border border-border shadow-2xl relative z-10">
        <h1 className="text-4xl font-extrabold mb-2 text-center text-gradient">Welcome Back</h1>
        <p className="text-muted text-center mb-8">Sign in to your Spacemates account</p>
        
        {state?.error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
            {state.error}
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-4">
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
            {isPending ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-8 text-center text-muted">Don't have an account? <Link href="/register" className="text-primary hover:underline font-medium">Register</Link></p>
      </div>
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-secondary/20 blur-[80px] rounded-full pointer-events-none" />
    </main>
  )
}
