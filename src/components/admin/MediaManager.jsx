import { useState, useRef, useCallback } from 'react'
import {
  Upload,
  Image,
  Link as LinkIcon,
  Trash2,
  Copy,
  Check,
  X,
  Loader2,
  FolderOpen,
  Grid,
  List,
  Search,
  Filter,
  HardDrive,
} from 'lucide-react'

// Mock data for demo - in production this would come from API/storage
const MOCK_MEDIA = [
  {
    id: '1',
    name: 'prewed-1.jpg',
    url: '/images/demo/prewed-1.jpg',
    type: 'image/jpeg',
    size: 245000,
    uploadedAt: '2025-01-08T10:00:00Z',
  },
  {
    id: '2',
    name: 'venue-photo.jpg',
    url: '/images/demo/venue.jpg',
    type: 'image/jpeg',
    size: 189000,
    uploadedAt: '2025-01-07T14:30:00Z',
  },
  {
    id: '3',
    name: 'couple-frame.png',
    url: '/images/demo/frame.png',
    type: 'image/png',
    size: 56000,
    uploadedAt: '2025-01-06T09:15:00Z',
  },
]

// Storage limits (in bytes)
const STORAGE_LIMIT = 100 * 1024 * 1024 // 100MB
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export default function MediaManager({
  onSelect,
  selectedMedia,
  allowMultiple = false,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
}) {
  const [media, setMedia] = useState(MOCK_MEDIA)
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [urlInput, setUrlInput] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  // Calculate storage used
  const storageUsed = media.reduce((total, m) => total + m.size, 0)
  const storagePercentage = (storageUsed / STORAGE_LIMIT) * 100

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleFileSelect = useCallback(
    async (e) => {
      const files = Array.from(e.target.files || [])
      if (files.length === 0) return

      setError('')
      setIsUploading(true)
      setUploadProgress(0)

      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]

          // Validate file type
          if (!acceptedTypes.includes(file.type)) {
            throw new Error(`Tipe file ${file.type} tidak didukung`)
          }

          // Validate file size
          if (file.size > MAX_FILE_SIZE) {
            throw new Error(`File ${file.name} terlalu besar (max 5MB)`)
          }

          // Simulate upload progress
          await new Promise((resolve) => {
            let progress = 0
            const interval = setInterval(() => {
              progress += 10
              setUploadProgress(progress)
              if (progress >= 100) {
                clearInterval(interval)
                resolve()
              }
            }, 100)
          })

          // In production, this would upload to storage (S3, R2, etc.)
          // For now, create a local URL
          const newMedia = {
            id: `${Date.now()}-${i}`,
            name: file.name,
            url: URL.createObjectURL(file),
            type: file.type,
            size: file.size,
            uploadedAt: new Date().toISOString(),
          }

          setMedia((prev) => [newMedia, ...prev])
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setIsUploading(false)
        setUploadProgress(0)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    },
    [acceptedTypes]
  )

  const handleUrlSubmit = useCallback(() => {
    if (!urlInput.trim()) return

    try {
      new URL(urlInput) // Validate URL
    } catch {
      setError('URL tidak valid')
      return
    }

    const newMedia = {
      id: `url-${Date.now()}`,
      name: urlInput.split('/').pop() || 'external-image',
      url: urlInput,
      type: 'image/external',
      size: 0,
      uploadedAt: new Date().toISOString(),
    }

    setMedia((prev) => [newMedia, ...prev])
    setUrlInput('')
    setShowUrlInput(false)
    setError('')
  }, [urlInput])

  const handleDelete = useCallback((id) => {
    setMedia((prev) => prev.filter((m) => m.id !== id))
  }, [])

  const handleCopyUrl = useCallback((id, url) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }, [])

  const handleSelect = useCallback(
    (item) => {
      if (!onSelect) return

      if (allowMultiple) {
        const isSelected = selectedMedia?.some((m) => m.id === item.id)
        if (isSelected) {
          onSelect(selectedMedia.filter((m) => m.id !== item.id))
        } else {
          onSelect([...(selectedMedia || []), item])
        }
      } else {
        onSelect(item)
      }
    },
    [onSelect, selectedMedia, allowMultiple]
  )

  // Filter media by search query
  const filteredMedia = media.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Media Manager</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-rose-100 text-rose-600'
                  : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-rose-100 text-rose-600'
                  : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari media..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              <span>Upload</span>
            </button>
            <button
              onClick={() => setShowUrlInput(!showUrlInput)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                showUrlInput
                  ? 'border-rose-500 text-rose-600 bg-rose-50'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              <span className="hidden sm:inline">URL</span>
            </button>
          </div>
        </div>

        {/* URL Input */}
        {showUrlInput && (
          <div className="mt-3 flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
            />
            <button
              onClick={handleUrlSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setShowUrlInput(false)
                setUrlInput('')
              }}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          multiple={allowMultiple}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="px-4 py-3 bg-rose-50 border-b">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-rose-500 animate-spin" />
            <div className="flex-1">
              <div className="h-2 bg-rose-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
            <span className="text-sm text-rose-600">{uploadProgress}%</span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="px-4 py-3 bg-red-50 border-b flex items-center justify-between">
          <span className="text-sm text-red-600">{error}</span>
          <button onClick={() => setError('')}>
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>
      )}

      {/* Media Grid/List */}
      <div className="p-4">
        {filteredMedia.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">
              {searchQuery ? 'Tidak ada media ditemukan' : 'Belum ada media'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Upload gambar untuk memulai
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMedia.map((item) => {
              const isSelected = allowMultiple
                ? selectedMedia?.some((m) => m.id === item.id)
                : selectedMedia?.id === item.id

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={`relative group rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-rose-500 ring-2 ring-rose-200'
                      : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className="aspect-square bg-gray-100">
                    {item.type.startsWith('image/') ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = ''
                          e.target.parentElement.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-gray-100">
                              <svg class="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          `
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCopyUrl(item.id, item.url)
                      }}
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                      title="Copy URL"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(item.id)
                      }}
                      className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>

                  {/* File name */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="text-xs text-white truncate">{item.name}</p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="divide-y">
            {filteredMedia.map((item) => {
              const isSelected = allowMultiple
                ? selectedMedia?.some((m) => m.id === item.id)
                : selectedMedia?.id === item.id

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-rose-50 border border-rose-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {item.type.startsWith('image/') ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(item.size)} •{' '}
                      {new Date(item.uploadedAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCopyUrl(item.id, item.url)
                      }}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(item.id)
                      }}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Storage Info */}
      <div className="p-4 bg-gray-50 border-t rounded-b-lg">
        <div className="flex items-center gap-3">
          <HardDrive className="w-4 h-4 text-gray-500" />
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">Storage</span>
              <span className="text-gray-500">
                {formatFileSize(storageUsed)} / {formatFileSize(STORAGE_LIMIT)}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  storagePercentage > 80 ? 'bg-red-500' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(storagePercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Modal wrapper for MediaManager
export function MediaManagerModal({ isOpen, onClose, onSelect, ...props }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white border-b">
          <h2 className="text-lg font-semibold text-gray-800">Pilih Media</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <MediaManager
          onSelect={(media) => {
            onSelect(media)
            onClose()
          }}
          {...props}
        />
      </div>
    </div>
  )
}
