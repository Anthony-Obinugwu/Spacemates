'use client'

import { useState, useActionState } from 'react'
import { FileUpload } from '@/components/FileUpload'
import { savePropertyAction, createListingUnitAction } from '@/app/actions/property'

export default function ListProperty() {
  const [propertyState, propertyFormAction, isSavingProperty] = useActionState(savePropertyAction, null)
  const [unitState, unitFormAction, isCreatingUnit] = useActionState(createListingUnitAction, null)

  const isStep1Complete = !!propertyState?.success
  const propertyId = propertyState?.propertyId || ''

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
          
          {/* Step 1: Property Details Form */}
          <div className="glass-panel p-8 rounded-3xl border border-border shadow-2xl">
            <div className="flex justify-between items-center border-b border-border pb-4 mb-6">
              <h2 className="text-2xl font-bold">1. Property Details</h2>
              {isStep1Complete && (
                <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 font-bold text-xs">
                  ✓ Draft Saved
                </span>
              )}
            </div>

            {propertyState?.error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
                {propertyState.error}
              </div>
            )}

            <form action={propertyFormAction} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted">Property Title</label>
                <input 
                  type="text" 
                  name="title" 
                  required
                  placeholder="e.g. Modern 3-Bedroom Apartment in Lekki Phase 1" 
                  className="p-4 rounded-xl bg-surface border border-border outline-none focus:border-primary transition-colors text-foreground" 
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted">Property Type</label>
                  <select name="propertyType" className="p-4 rounded-xl bg-surface border border-border outline-none focus:border-primary transition-colors appearance-none">
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted">City</label>
                  <input type="text" name="city" placeholder="Lagos" className="p-4 rounded-xl bg-surface border border-border outline-none focus:border-primary transition-colors text-foreground" />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted">Description</label>
                <textarea name="description" placeholder="Describe the property, amenities, and neighborhood..." className="p-4 rounded-xl bg-surface border border-border outline-none focus:border-primary transition-colors h-32 resize-none"></textarea>
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
                <input type="text" name="streetAddress" placeholder="Street Address" className="p-4 rounded-xl bg-surface border border-border outline-none focus:border-primary transition-colors text-foreground" />
              </div>

              <button 
                type="submit" 
                disabled={isSavingProperty}
                className="mt-4 px-8 py-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-50"
              >
                {isSavingProperty ? 'Saving Draft...' : 'Save Property Draft & Proceed to Step 2 →'}
              </button>
            </form>
          </div>

          {/* Step 2: Units & Listings Form */}
          <div className={`glass-panel p-8 rounded-3xl border border-border shadow-2xl transition-all duration-500 ${!isStep1Complete ? 'opacity-50 pointer-events-none' : 'ring-2 ring-primary/50'}`}>
            <div className="flex justify-between items-center border-b border-border pb-4 mb-6">
              <h2 className="text-2xl font-bold">2. Units & Listings</h2>
              {!isStep1Complete ? (
                <span className="text-xs font-bold uppercase tracking-widest text-muted bg-surface px-3 py-1 rounded-full border border-border">
                  Locked (Complete Step 1)
                </span>
              ) : (
                <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  Unlocked
                </span>
              )}
            </div>

            <p className="text-muted text-sm mb-6">
              Now break your property down into rentable units/rooms and set pricing.
            </p>

            <form action={unitFormAction} className="flex flex-col gap-6">
              <input type="hidden" name="propertyId" value={propertyId} />

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted">Unit / Room Title</label>
                <input 
                  type="text" 
                  name="unitName" 
                  required
                  placeholder="e.g. Master Bedroom with Private Balcony" 
                  className="p-4 rounded-xl bg-surface border border-border outline-none focus:border-primary transition-colors text-foreground" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted">Listing Type</label>
                  <select name="listingType" className="p-4 rounded-xl bg-surface border border-border outline-none focus:border-primary transition-colors appearance-none">
                    <option value="ROOM_AVAILABLE">Room Available (Shared Flat)</option>
                    <option value="ENTIRE_PROPERTY">Entire Property</option>
                    <option value="ROOMMATE_WANTED">Roommate Wanted</option>
                    <option value="CO_RENTING">Co-renting Group</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted">Yearly Rent (NGN ₦)</label>
                  <input 
                    type="number" 
                    name="rentAmount" 
                    required
                    placeholder="1200000" 
                    className="p-4 rounded-xl bg-surface border border-border outline-none focus:border-primary transition-colors text-foreground" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isCreatingUnit}
                className="mt-4 px-8 py-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(34,197,94,0.3)] disabled:opacity-50"
              >
                {isCreatingUnit ? 'Publishing Listing...' : 'Publish Listing to Marketplace 🚀'}
              </button>
            </form>
          </div>

        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-6 rounded-3xl border border-border sticky top-8">
            <h3 className="font-bold text-lg mb-4">How it works</h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold border ${isStep1Complete ? 'bg-green-500 text-white border-green-500' : 'bg-primary/20 text-primary border-primary/30'}`}>1</div>
                <div>
                  <h4 className="font-semibold text-sm">Create Property Draft</h4>
                  <p className="text-xs text-muted mt-1">Define the building title, private address, and upload photos.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold border ${isStep1Complete ? 'bg-primary/20 text-primary border-primary/30' : 'bg-surface text-muted border-border'}`}>2</div>
                <div>
                  <h4 className="font-semibold text-sm">Add Units & Publish</h4>
                  <p className="text-xs text-muted mt-1">Set rent breakdown and publish directly to the marketplace.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
