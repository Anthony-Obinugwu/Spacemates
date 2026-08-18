'use client'

import Link from 'next/link'
import { FileUpload } from '@/components/FileUpload'

export default function ListProperty() {
  return (
    <main className="flex-1 max-w-5xl mx-auto w-full p-6 py-12 relative">
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 blur-[120px] pointer-events-none" />
      
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl font-extrabold mb-4 text-gradient">List Your Property</h1>
        <p className="text-lg text-muted max-w-2xl">
          Create a detailed property profile, add specific rooms/units, upload high-quality photos, and publish listings securely.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          <div className="glass-panel p-8 rounded-3xl border border-border shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 border-b border-border pb-4">1. Property Details</h2>
            <form className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted">Property Title</label>
                <input type="text" placeholder="e.g. Modern 3-Bedroom Apartment in Lekki Phase 1" className="p-4 rounded-xl bg-surface border border-border outline-none focus:border-primary transition-colors text-foreground" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted">Property Type</label>
                  <select className="p-4 rounded-xl bg-surface border border-border outline-none focus:border-primary transition-colors appearance-none">
                    <option>Apartment</option>
                    <option>House</option>
                    <option>Studio</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted">City</label>
                  <input type="text" placeholder="Lagos" className="p-4 rounded-xl bg-surface border border-border outline-none focus:border-primary transition-colors text-foreground" />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted">Description</label>
                <textarea placeholder="Describe the property, amenities, and neighborhood..." className="p-4 rounded-xl bg-surface border border-border outline-none focus:border-primary transition-colors h-32 resize-none"></textarea>
              </div>

              {/* Drag-and-Drop Photo Upload Gallery */}
              <div className="mt-2 pt-4 border-t border-border">
                <FileUpload
                  bucket="property-media"
                  maxFiles={6}
                  label="Property Photo Gallery"
                  allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                />
              </div>

              <div className="flex flex-col gap-2 p-5 bg-surface/50 rounded-xl border border-border mt-2">
                <h3 className="font-semibold mb-2">Private Address</h3>
                <p className="text-sm text-muted mb-4">Exact addresses are kept private and are never shown publicly until a verified application is accepted.</p>
                <input type="text" placeholder="Street Address" className="p-4 rounded-xl bg-surface border border-border outline-none focus:border-primary transition-colors text-foreground" />
              </div>

              <button type="submit" className="mt-4 px-8 py-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                Save Property Draft
              </button>
            </form>
          </div>

        </div>

        <div className="lg:col-span-1">
          <div className="glass-panel p-6 rounded-3xl border border-border sticky top-8">
            <h3 className="font-bold text-lg mb-4">How it works</h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold border border-primary/30">1</div>
                <div>
                  <h4 className="font-semibold text-sm">Create the Property</h4>
                  <p className="text-xs text-muted mt-1">Define the physical building and upload photos.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold border border-secondary/30">2</div>
                <div>
                  <h4 className="font-semibold text-sm">Add Units & Rooms</h4>
                  <p className="text-xs text-muted mt-1">Break the property down into rentable bedrooms or entire spaces.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold border border-accent/30">3</div>
                <div>
                  <h4 className="font-semibold text-sm">Publish Listings</h4>
                  <p className="text-xs text-muted mt-1">Attach expenses (rent, service charge) and publish to the marketplace.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
