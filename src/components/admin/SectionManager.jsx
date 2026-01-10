import { useState, useCallback } from 'react'
import {
  GripVertical,
  Eye,
  EyeOff,
  Settings,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Home,
  Heart,
  Clock,
  Calendar,
  MapPin,
  Image,
  Gift,
  MessageCircle,
  BookOpen,
  X,
} from 'lucide-react'

// Default sections configuration
const DEFAULT_SECTIONS = [
  {
    id: 'landing',
    name: 'Opening/Landing',
    icon: Home,
    enabled: true,
    animation: 'fade-scale',
    required: true,
  },
  {
    id: 'hero',
    name: 'Hero & Countdown',
    icon: Clock,
    enabled: true,
    animation: 'parallax-scroll',
    required: false,
  },
  {
    id: 'couple',
    name: 'Info Mempelai',
    icon: Heart,
    enabled: true,
    animation: 'fade-in-view',
    required: true,
  },
  {
    id: 'story',
    name: 'Love Story',
    icon: BookOpen,
    enabled: false,
    animation: 'stagger-children',
    required: false,
  },
  {
    id: 'events',
    name: 'Agenda & Acara',
    icon: Calendar,
    enabled: true,
    animation: 'slide-from-side',
    required: true,
  },
  {
    id: 'location',
    name: 'Lokasi & Maps',
    icon: MapPin,
    enabled: true,
    animation: 'fade-in-view',
    required: false,
  },
  {
    id: 'gallery',
    name: 'Galeri Foto',
    icon: Image,
    enabled: false,
    animation: 'masonry-fade',
    required: false,
  },
  {
    id: 'gift',
    name: 'Amplop Digital',
    icon: Gift,
    enabled: true,
    animation: 'fade-in-view',
    required: false,
  },
  {
    id: 'wishes',
    name: 'RSVP & Ucapan',
    icon: MessageCircle,
    enabled: true,
    animation: 'fade-in-view',
    required: true,
  },
  {
    id: 'closing',
    name: 'Penutup',
    icon: Heart,
    enabled: true,
    animation: 'fade-scale',
    required: false,
  },
]

// Animation options
const ANIMATION_OPTIONS = [
  { id: 'none', name: 'Tanpa Animasi' },
  { id: 'fade-scale', name: 'Fade & Scale' },
  { id: 'fade-in-view', name: 'Fade In View' },
  { id: 'slide-up', name: 'Slide Up' },
  { id: 'slide-from-side', name: 'Slide From Side' },
  { id: 'stagger-children', name: 'Stagger Children' },
  { id: 'parallax-scroll', name: 'Parallax Scroll' },
  { id: 'zoom-reveal', name: 'Zoom Reveal' },
  { id: 'masonry-fade', name: 'Masonry Fade' },
]

export default function SectionManager({ sections: initialSections, onChange }) {
  const [sections, setSections] = useState(initialSections || DEFAULT_SECTIONS)
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [expandedSection, setExpandedSection] = useState(null)

  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.target.outerHTML)
    e.target.style.opacity = '0.4'
  }

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1'
    setDraggedIndex(null)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()

    if (draggedIndex === null || draggedIndex === dropIndex) return

    const newSections = [...sections]
    const [draggedSection] = newSections.splice(draggedIndex, 1)
    newSections.splice(dropIndex, 0, draggedSection)

    setSections(newSections)
    onChange?.(newSections)
    setDraggedIndex(null)
  }

  const toggleSection = useCallback(
    (index) => {
      const section = sections[index]
      if (section.required) return

      const newSections = [...sections]
      newSections[index] = { ...section, enabled: !section.enabled }
      setSections(newSections)
      onChange?.(newSections)
    },
    [sections, onChange]
  )

  const updateAnimation = useCallback(
    (index, animation) => {
      const newSections = [...sections]
      newSections[index] = { ...newSections[index], animation }
      setSections(newSections)
      onChange?.(newSections)
    },
    [sections, onChange]
  )

  const moveSection = useCallback(
    (index, direction) => {
      const newIndex = index + direction
      if (newIndex < 0 || newIndex >= sections.length) return

      const newSections = [...sections]
      const [movedSection] = newSections.splice(index, 1)
      newSections.splice(newIndex, 0, movedSection)

      setSections(newSections)
      onChange?.(newSections)
    },
    [sections, onChange]
  )

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-800">Section Manager</h3>
        <p className="text-sm text-gray-500 mt-1">
          Drag & drop untuk mengubah urutan section
        </p>
      </div>

      <div className="divide-y">
        {sections.map((section, index) => {
          const Icon = section.icon
          const isExpanded = expandedSection === section.id

          return (
            <div
              key={section.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className={`transition-all ${
                draggedIndex === index
                  ? 'bg-rose-50 border-rose-200'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3 p-4">
                {/* Drag Handle */}
                <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                  <GripVertical className="w-5 h-5" />
                </div>

                {/* Toggle */}
                <button
                  onClick={() => toggleSection(index)}
                  disabled={section.required}
                  className={`p-2 rounded-lg transition-colors ${
                    section.enabled
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-400'
                  } ${section.required ? 'cursor-not-allowed opacity-50' : ''}`}
                  title={
                    section.required
                      ? 'Section wajib tidak bisa dinonaktifkan'
                      : section.enabled
                      ? 'Klik untuk nonaktifkan'
                      : 'Klik untuk aktifkan'
                  }
                >
                  {section.enabled ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>

                {/* Icon & Name */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`p-2 rounded-lg ${
                      section.enabled ? 'bg-rose-100' : 'bg-gray-100'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        section.enabled ? 'text-rose-600' : 'text-gray-400'
                      }`}
                    />
                  </div>
                  <div>
                    <span
                      className={`font-medium ${
                        section.enabled ? 'text-gray-800' : 'text-gray-400'
                      }`}
                    >
                      {section.name}
                    </span>
                    {section.required && (
                      <span className="ml-2 text-xs text-rose-500 bg-rose-50 px-2 py-0.5 rounded">
                        Wajib
                      </span>
                    )}
                  </div>
                </div>

                {/* Animation Badge */}
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                  <Sparkles className="w-4 h-4" />
                  <span className="capitalize">
                    {ANIMATION_OPTIONS.find((a) => a.id === section.animation)?.name ||
                      section.animation}
                  </span>
                </div>

                {/* Move Buttons (Mobile) */}
                <div className="flex items-center gap-1 sm:hidden">
                  <button
                    onClick={() => moveSection(index, -1)}
                    disabled={index === 0}
                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveSection(index, 1)}
                    disabled={index === sections.length - 1}
                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Settings Toggle */}
                <button
                  onClick={() =>
                    setExpandedSection(isExpanded ? null : section.id)
                  }
                  className={`p-2 rounded-lg transition-colors ${
                    isExpanded
                      ? 'bg-rose-100 text-rose-600'
                      : 'hover:bg-gray-100 text-gray-400'
                  }`}
                >
                  {isExpanded ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Settings className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Expanded Settings */}
              {isExpanded && (
                <div className="px-4 pb-4 pl-14 bg-gray-50 border-t">
                  <div className="pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Animasi
                    </label>
                    <select
                      value={section.animation}
                      onChange={(e) => updateAnimation(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
                    >
                      {ANIMATION_OPTIONS.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-2">
                      Animasi akan diterapkan saat section muncul di viewport
                    </p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="p-4 bg-gray-50 border-t rounded-b-lg">
        <p className="text-xs text-gray-500 flex items-center gap-2">
          <GripVertical className="w-4 h-4" />
          Drag untuk mengubah urutan • Klik mata untuk aktif/nonaktif • Klik
          gear untuk pengaturan animasi
        </p>
      </div>
    </div>
  )
}

// Hook for using section manager
export function useSectionManager(initialSections = DEFAULT_SECTIONS) {
  const [sections, setSections] = useState(initialSections)

  const updateSections = useCallback((newSections) => {
    setSections(newSections)
  }, [])

  const getSectionOrder = useCallback(() => {
    return sections.filter((s) => s.enabled).map((s) => s.id)
  }, [sections])

  const getSectionConfig = useCallback(
    (sectionId) => {
      return sections.find((s) => s.id === sectionId)
    },
    [sections]
  )

  return {
    sections,
    updateSections,
    getSectionOrder,
    getSectionConfig,
  }
}

export { DEFAULT_SECTIONS, ANIMATION_OPTIONS }
