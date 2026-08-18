'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'

interface FileUploadProps {
  bucket: 'property-media' | 'kyc-documents'
  maxFiles?: number
  allowedTypes?: string[]
  maxSizeBytes?: number
  onUploadComplete?: (urls: string[]) => void
  label?: string
}

export function FileUpload({
  bucket,
  maxFiles = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  maxSizeBytes = 5 * 1024 * 1024,
  onUploadComplete,
  label = 'Upload Files',
}: FileUploadProps) {
  const [files, setFiles] = useState<{ file: File; preview: string; progress: number; url?: string; error?: string }[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const newFiles = Array.from(selectedFiles).slice(0, maxFiles - files.length)
    const validFiles = newFiles.map((file) => {
      let error = undefined
      if (file.size > maxSizeBytes) {
        error = `File exceeds ${(maxSizeBytes / (1024 * 1024)).toFixed(0)}MB limit`
      } else if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        error = 'Unsupported file type'
      }

      return {
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
        progress: 0,
        error,
      }
    })

    setFiles((prev) => [...prev, ...validFiles])
  }

  const handleUpload = async () => {
    if (files.length === 0) return
    setIsUploading(true)

    const uploadedUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const item = files[i]
      if (item.error || item.url) {
        if (item.url) uploadedUrls.push(item.url)
        continue
      }

      const fileExt = item.file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${fileName}`

      const { data, error } = await supabase.storage.from(bucket).upload(filePath, item.file)

      if (error) {
        setFiles((prev) => prev.map((f, idx) => (idx === i ? { ...f, error: error.message } : f)))
      } else {
        const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath)
        const finalUrl = publicUrlData?.publicUrl || filePath
        uploadedUrls.push(finalUrl)

        setFiles((prev) => prev.map((f, idx) => (idx === i ? { ...f, progress: 100, url: finalUrl } : f)))
      }
    }

    setIsUploading(false)
    if (onUploadComplete && uploadedUrls.length > 0) {
      onUploadComplete(uploadedUrls)
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index))
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <label className="text-sm font-semibold text-foreground">{label}</label>

      {/* Drag and Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-border hover:border-primary/50 bg-surface/30 p-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors text-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted mb-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
        <p className="text-sm font-medium text-foreground">Click or drag & drop files here</p>
        <p className="text-xs text-muted mt-1">JPEG, PNG, WebP or PDF (Max {(maxSizeBytes / (1024 * 1024)).toFixed(0)}MB per file)</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple={maxFiles > 1}
          accept={allowedTypes.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Selected Files Preview List */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
          {files.map((item, idx) => (
            <div key={idx} className="relative group glass-panel p-2 rounded-xl border border-border flex flex-col items-center justify-between overflow-hidden">
              {item.preview ? (
                <img src={item.preview} alt="preview" className="w-full h-24 object-cover rounded-lg mb-2" />
              ) : (
                <div className="w-full h-24 bg-surface rounded-lg mb-2 flex items-center justify-center text-xs text-muted font-mono break-all p-1 text-center">
                  {item.file.name}
                </div>
              )}

              <div className="w-full flex justify-between items-center px-1">
                <span className="text-[10px] text-muted truncate max-w-[80px]">{item.file.name}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(idx)
                  }}
                  className="text-red-400 hover:text-red-500 text-xs font-bold"
                >
                  &times;
                </button>
              </div>

              {item.error && <span className="text-[10px] text-red-400 mt-1">{item.error}</span>}
              {item.url && <span className="text-[10px] text-green-400 font-semibold mt-1">Uploaded ✓</span>}
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={isUploading}
          className="self-start px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-all shadow-md shadow-primary/20 disabled:opacity-50"
        >
          {isUploading ? 'Uploading...' : 'Confirm & Upload Files'}
        </button>
      )}
    </div>
  )
}
