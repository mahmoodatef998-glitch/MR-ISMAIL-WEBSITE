'use client'

import { useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2, ImageIcon } from 'lucide-react'

interface Props {
  images: string[]
  onChange: (images: string[]) => void
}

export function ImageUploader({ images, onChange }: Props) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!file.type.startsWith('image/')) return null
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    if (!res.ok) return null
    const { url } = await res.json()
    return url as string
  }

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (!arr.length) return

    const ids = arr.map(() => Math.random().toString(36).slice(2))
    setUploading(prev => [...prev, ...ids])

    const urls = await Promise.all(arr.map(uploadFile))
    const valid = urls.filter(Boolean) as string[]

    onChange([...images, ...valid])
    setUploading(prev => prev.filter(id => !ids.includes(id)))
  }, [images, onChange])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)

  const removeImage = (i: number) => {
    onChange(images.filter((_, idx) => idx !== i))
  }

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return
    const next = [...images]
    ;[next[from], next[to]] = [next[to], next[from]]
    onChange(next)
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          dragging
            ? 'border-[#c8a96e] bg-[#c8a96e]/5 scale-[1.01]'
            : 'border-white/10 hover:border-[#c8a96e]/40 hover:bg-white/[0.02]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => e.target.files && handleFiles(e.target.files)}
        />
        <Upload className={`w-8 h-8 mx-auto mb-3 transition-colors ${dragging ? 'text-[#c8a96e]' : 'text-gray-600'}`} />
        <p className="text-sm font-medium text-gray-300 mb-1">
          {dragging ? 'Drop to upload' : 'Drag & drop images here'}
        </p>
        <p className="text-xs text-gray-600">or click to browse — JPG, PNG, WebP, max 10MB each</p>

        {/* Uploading spinners */}
        {uploading.length > 0 && (
          <div className="absolute inset-0 bg-[#0a1628]/80 rounded-xl flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 text-[#c8a96e] animate-spin" />
            <span className="text-sm text-[#c8a96e]">Uploading {uploading.length} image{uploading.length > 1 ? 's' : ''}…</span>
          </div>
        )}
      </div>

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((url, i) => (
            <div key={url} className="group relative aspect-square bg-[#050b18] rounded-xl overflow-hidden border border-white/5">
              <Image src={url} alt="" fill className="object-contain p-2" />

              {/* Overlay controls */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
                {/* Reorder */}
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveImage(i, i - 1)}
                    disabled={i === 0}
                    className="w-6 h-6 rounded bg-white/20 text-white text-xs disabled:opacity-30 hover:bg-white/30 transition-colors"
                  >←</button>
                  <button
                    type="button"
                    onClick={() => moveImage(i, i + 1)}
                    disabled={i === images.length - 1}
                    className="w-6 h-6 rounded bg-white/20 text-white text-xs disabled:opacity-30 hover:bg-white/30 transition-colors"
                  >→</button>
                </div>
              </div>

              {/* Main badge */}
              {i === 0 && (
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-[#c8a96e] text-[#050b18] text-[9px] font-bold rounded uppercase tracking-wide">
                  Main
                </div>
              )}
            </div>
          ))}

          {/* Add more slot */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-[#c8a96e]/40 flex flex-col items-center justify-center gap-1.5 text-gray-600 hover:text-[#c8a96e] transition-all"
          >
            <ImageIcon className="w-5 h-5" />
            <span className="text-[10px]">Add more</span>
          </button>
        </div>
      )}
    </div>
  )
}
