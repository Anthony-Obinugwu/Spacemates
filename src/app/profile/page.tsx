'use client'

import Link from 'next/link'
import { FileUpload } from '@/components/FileUpload'

export default function ProfileDashboard() {
  return (
    <main className="flex-1 max-w-6xl mx-auto w-full p-6 py-12 relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 blur-[100px] pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gradient">Profile Dashboard</h1>
        <button className="px-6 py-2 rounded-full bg-surface hover:bg-surface-hover border border-border font-medium transition-colors">
          Edit Profile
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-panel p-8 rounded-3xl border border-border flex flex-col items-center text-center shadow-lg">
            <div className="w-40 h-40 rounded-full bg-surface border-4 border-primary mb-6 flex items-center justify-center text-6xl overflow-hidden shadow-[0_0_30px_rgba(99,102,241,0.2)]">
              🚀
            </div>
            <h2 className="text-2xl font-bold mb-1">Alex Mercer</h2>
            <p className="text-muted mb-6">Product Designer • Lagos</p>
            <div className="w-full flex justify-center bg-green-500/10 border border-green-500/20 py-2 rounded-xl text-green-400 font-medium text-sm">
              <span className="mr-2">✓</span> Identity Verified
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-3xl border border-border shadow-lg">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Roles</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium border border-primary/30">Room Seeker</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="glass-panel p-8 rounded-3xl border border-border shadow-lg">
            <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
              <h3 className="text-xl font-bold">Lifestyle & Compatibility</h3>
              <button className="text-primary hover:text-primary-hover font-medium text-sm transition-colors">Update</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-surface/50 p-5 rounded-2xl border border-border">
                <span className="text-muted text-sm block mb-2">Cleanliness</span>
                <span className="font-semibold text-lg">Very clean and organized</span>
              </div>
              <div className="bg-surface/50 p-5 rounded-2xl border border-border">
                <span className="text-muted text-sm block mb-2">Pets</span>
                <span className="font-semibold text-lg">No pets allowed</span>
                <span className="mt-2 inline-block px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400 border border-red-500/30">Dealbreaker</span>
              </div>
              <div className="bg-surface/50 p-5 rounded-2xl border border-border">
                <span className="text-muted text-sm block mb-2">Sleep Schedule</span>
                <span className="font-semibold text-lg">Early bird</span>
              </div>
            </div>
          </div>
          
          {/* Identity & KYC Verification Upload Section */}
          <div className="glass-panel p-8 rounded-3xl border border-border shadow-lg">
            <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
              <h3 className="text-xl font-bold">Identity & Verification Documents</h3>
            </div>
            <p className="text-sm text-muted mb-6 bg-surface p-4 rounded-xl border border-border">
              Documents are stored securely in a private, encrypted bucket and accessible strictly to you and platform moderators.
            </p>
            
            <FileUpload
              bucket="kyc-documents"
              maxFiles={2}
              label="Upload Government ID (National ID, Drivers License, or Passport)"
              allowedTypes={['image/jpeg', 'image/png', 'application/pdf']}
              maxSizeBytes={10 * 1024 * 1024}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
