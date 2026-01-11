import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import {
  fetchInvitation,
  createInvitation,
  updateInvitation,
  fetchThemes,
  fetchStatsAdmin,
  fetchWishesAdmin,
  savePhotos,
  uploadPhoto
} from '@/services/adminApi'
import { ArrowLeft, Plus, Trash2, Save, Eye, Users, MessageSquare, Image, GripVertical, Upload, Link } from 'lucide-react'

export default function InvitationForm() {
  const navigate = useNavigate()
  const { uid } = useParams()
  const isEdit = Boolean(uid)

  const [isLoading, setIsLoading] = useState(isEdit)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [themes, setThemes] = useState([])
  const [stats, setStats] = useState(null)
  const [wishes, setWishes] = useState([])
  const [activeTab, setActiveTab] = useState('basic')

  const [form, setForm] = useState({
    uid: '',
    title: '',
    description: '',
    groom_name: '',
    bride_name: '',
    parent_groom: '',
    parent_bride: '',
    wedding_date: '',
    time: '',
    location: '',
    address: '',
    maps_url: '',
    maps_embed: '',
    og_image: '/images/og-image.jpg',
    favicon: '/images/favicon.ico',
    theme: 'default',
    audio: {
      src: '/audio/fulfilling-humming.mp3',
      title: 'Fulfilling Humming',
      autoplay: true,
      loop: true
    },
    agenda: [],
    banks: [],
    photos: []
  })

  useEffect(() => {
    loadThemes()
    if (isEdit) {
      loadInvitation()
      loadStats()
      loadWishes()
    }
  }, [uid])

  const loadThemes = async () => {
    try {
      const response = await fetchThemes()
      setThemes(response.data || [])
    } catch (err) {
      console.error('Failed to load themes:', err)
    }
  }

  const loadInvitation = async () => {
    try {
      setIsLoading(true)
      const response = await fetchInvitation(uid)
      const data = response.data

      setForm({
        uid: data.uid,
        title: data.title || '',
        description: data.description || '',
        groom_name: data.groomName || data.groom_name || '',
        bride_name: data.brideName || data.bride_name || '',
        parent_groom: data.parentGroom || data.parent_groom || '',
        parent_bride: data.parentBride || data.parent_bride || '',
        wedding_date: data.weddingDate ? data.weddingDate.split('T')[0] : (data.wedding_date ? data.wedding_date.split('T')[0] : ''),
        time: data.time || '',
        location: data.location || '',
        address: data.address || '',
        maps_url: data.mapsUrl || data.maps_url || '',
        maps_embed: data.mapsEmbed || data.maps_embed || '',
        og_image: data.ogImage || data.og_image || '/images/og-image.jpg',
        favicon: data.favicon || '/images/favicon.ico',
        theme: data.theme || 'default',
        audio: data.audio || {
          src: '/audio/fulfilling-humming.mp3',
          title: 'Fulfilling Humming',
          autoplay: true,
          loop: true
        },
        agenda: (data.agenda || []).map((a) => ({
          title: a.title,
          date: a.date,
          start_time: a.startTime || a.start_time || '',
          end_time: a.endTime || a.end_time || '',
          location: a.location || '',
          address: a.address || ''
        })),
        banks: (data.banks || []).map((b) => ({
          bank: b.bank,
          account_number: b.accountNumber || b.account_number || '',
          account_name: b.accountName || b.account_name || ''
        })),
        photos: (data.photos || []).map((p) => ({
          id: p.id,
          src: p.src || '',
          alt: p.alt || '',
          caption: p.caption || ''
        }))
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetchStatsAdmin(uid)
      setStats(response.data)
    } catch (err) {
      console.error('Failed to load stats:', err)
    }
  }

  const loadWishes = async () => {
    try {
      const response = await fetchWishesAdmin(uid)
      setWishes(response.data || [])
    } catch (err) {
      console.error('Failed to load wishes:', err)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAudioChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      audio: {
        ...prev.audio,
        [name]: type === 'checkbox' ? checked : value
      }
    }))
  }

  const addAgenda = () => {
    setForm((prev) => ({
      ...prev,
      agenda: [
        ...prev.agenda,
        { title: '', date: '', start_time: '', end_time: '', location: '', address: '' }
      ]
    }))
  }

  const updateAgenda = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      agenda: prev.agenda.map((a, i) => (i === index ? { ...a, [field]: value } : a))
    }))
  }

  const removeAgenda = (index) => {
    setForm((prev) => ({
      ...prev,
      agenda: prev.agenda.filter((_, i) => i !== index)
    }))
  }

  const addBank = () => {
    setForm((prev) => ({
      ...prev,
      banks: [...prev.banks, { bank: '', account_number: '', account_name: '' }]
    }))
  }

  const updateBank = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      banks: prev.banks.map((b, i) => (i === index ? { ...b, [field]: value } : b))
    }))
  }

  const removeBank = (index) => {
    setForm((prev) => ({
      ...prev,
      banks: prev.banks.filter((_, i) => i !== index)
    }))
  }

  const generateUid = () => {
    const groom = form.groom_name.toLowerCase().replace(/\s+/g, '-') || 'groom'
    const bride = form.bride_name.toLowerCase().replace(/\s+/g, '-') || 'bride'
    const year = form.wedding_date ? new Date(form.wedding_date).getFullYear() : new Date().getFullYear()
    return `${groom}-${bride}-${year}`
  }

  const transformFormToApi = (formData) => {
    return {
      uid: formData.uid,
      title: formData.title,
      description: formData.description,
      groomName: formData.groom_name,
      brideName: formData.bride_name,
      parentGroom: formData.parent_groom,
      parentBride: formData.parent_bride,
      weddingDate: formData.wedding_date,
      time: formData.time,
      location: formData.location,
      address: formData.address,
      mapsUrl: formData.maps_url,
      mapsEmbed: formData.maps_embed,
      ogImage: formData.og_image,
      favicon: formData.favicon,
      theme: formData.theme,
      audio: formData.audio,
      agenda: formData.agenda.map((a) => ({
        title: a.title,
        date: a.date,
        startTime: a.start_time,
        endTime: a.end_time,
        location: a.location,
        address: a.address
      })),
      banks: formData.banks.map((b) => ({
        bank: b.bank,
        accountNumber: b.account_number,
        accountName: b.account_name
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSaving(true)

    try {
      const apiData = transformFormToApi(form)
      if (isEdit) {
        await updateInvitation(uid, apiData)
        // Save photos separately
        if (form.photos.length > 0) {
          await savePhotos(uid, form.photos.map((p, index) => ({
            src: p.src,
            alt: p.alt,
            caption: p.caption,
            orderIndex: index
          })))
        }
      } else {
        const result = await createInvitation(apiData)
        // Save photos for new invitation
        if (form.photos.length > 0 && result.data?.uid) {
          await savePhotos(result.data.uid, form.photos.map((p, index) => ({
            src: p.src,
            alt: p.alt,
            caption: p.caption,
            orderIndex: index
          })))
        }
      }
      navigate('/admin/invitations')
    } catch (err) {
      setError(err.message)
      window.scrollTo(0, 0)
    } finally {
      setIsSaving(false)
    }
  }

  // Photo management functions
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  const addPhoto = () => {
    setForm((prev) => ({
      ...prev,
      photos: [...prev.photos, { src: '', alt: '', caption: '' }]
    }))
  }

  const updatePhoto = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.map((photo, i) =>
        i === index ? { ...photo, [field]: value } : photo
      )
    }))
  }

  const removePhoto = (index) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }))
  }

  const handleFileUpload = async (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // For new invitations, we need uid first
    const invitationUid = uid || form.uid
    if (!invitationUid) {
      setError('Harap isi UID undangan terlebih dahulu sebelum upload foto')
      setActiveTab('basic')
      return
    }

    setUploadingPhoto(true)
    try {
      for (const file of files) {
        const result = await uploadPhoto(invitationUid, file)
        if (result.success && result.data?.url) {
          setForm((prev) => ({
            ...prev,
            photos: [...prev.photos, {
              src: result.data.url,
              alt: file.name.split('.')[0],
              caption: ''
            }]
          }))
        }
      }
    } catch (err) {
      setError('Gagal upload foto: ' + err.message)
    } finally {
      setUploadingPhoto(false)
      // Reset file input
      e.target.value = ''
    }
  }

  const getInvitationUrl = () => {
    const baseUrl = window.location.origin
    return `${baseUrl}/${form.uid || uid}`
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
        </div>
      </AdminLayout>
    )
  }

  const tabs = [
    { id: 'basic', label: 'Info Dasar' },
    { id: 'details', label: 'Detail Acara' },
    { id: 'agenda', label: 'Agenda' },
    { id: 'banks', label: 'Amplop Digital' },
    { id: 'media', label: 'Media' },
    { id: 'gallery', label: 'Galeri Foto' }
  ]

  if (isEdit) {
    tabs.push({ id: 'stats', label: 'Statistik' })
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/invitations')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft size={20} />
          <span>Kembali</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isEdit ? 'Edit Undangan' : 'Buat Undangan Baru'}
            </h1>
            {isEdit && (
              <p className="text-gray-500 mt-1">
                UID: <code className="bg-gray-100 px-2 py-0.5 rounded">{uid}</code>
              </p>
            )}
          </div>

          {isEdit && (
            <a
              href={getInvitationUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Eye size={20} />
              <span>Lihat Undangan</span>
            </a>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b overflow-x-auto">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-rose-600 border-b-2 border-rose-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Informasi Pasangan</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Mempelai Pria *
                </label>
                <input
                  type="text"
                  name="groom_name"
                  value={form.groom_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                  placeholder="Ahmad"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Mempelai Wanita *
                </label>
                <input
                  type="text"
                  name="bride_name"
                  value={form.bride_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                  placeholder="Fatimah"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Orang Tua Mempelai Pria
                </label>
                <input
                  type="text"
                  name="parent_groom"
                  value={form.parent_groom}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                  placeholder="Bapak X & Ibu Y"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Orang Tua Mempelai Wanita
                </label>
                <input
                  type="text"
                  name="parent_bride"
                  value={form.parent_bride}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                  placeholder="Bapak A & Ibu B"
                />
              </div>
            </div>

            {!isEdit && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UID (URL) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="uid"
                    value={form.uid}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                    placeholder="ahmad-fatimah-2025"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, uid: generateUid() }))}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Generate
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  URL undangan akan menjadi: {window.location.origin}/{form.uid || 'uid-anda'}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                placeholder="Undangan Pernikahan Ahmad & Fatimah"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none resize-none"
                placeholder="Dengan memohon rahmat dan ridho Allah SWT..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tema</label>
              <select
                name="theme"
                value={form.theme}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
              >
                {themes.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Detail Acara Utama</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Pernikahan *
                </label>
                <input
                  type="date"
                  name="wedding_date"
                  value={form.wedding_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Waktu</label>
                <input
                  type="text"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                  placeholder="08:00 - 12:00 WIB"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lokasi</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                placeholder="Gedung Serbaguna XYZ"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none resize-none"
                placeholder="Jl. Raya No. 123, Kota..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link Google Maps</label>
              <input
                type="url"
                name="maps_url"
                value={form.maps_url}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                placeholder="https://maps.google.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Embed Maps (iframe src)</label>
              <input
                type="text"
                name="maps_embed"
                value={form.maps_embed}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Dapatkan dari Google Maps: Share → Embed a map → Copy src URL
              </p>
            </div>
          </div>
        )}

        {/* Agenda Tab */}
        {activeTab === 'agenda' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Agenda Acara</h2>
              <button
                type="button"
                onClick={addAgenda}
                className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
              >
                <Plus size={20} />
                <span>Tambah Agenda</span>
              </button>
            </div>

            {form.agenda.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Belum ada agenda. Klik tombol di atas untuk menambahkan.
              </p>
            ) : (
              <div className="space-y-6">
                {form.agenda.map((agenda, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-700">Agenda {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeAgenda(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Nama Acara</label>
                        <input
                          type="text"
                          value={agenda.title}
                          onChange={(e) => updateAgenda(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                          placeholder="Akad Nikah"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Tanggal</label>
                        <input
                          type="date"
                          value={agenda.date ? agenda.date.split('T')[0] : ''}
                          onChange={(e) => updateAgenda(index, 'date', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Jam Mulai</label>
                        <input
                          type="time"
                          value={agenda.start_time || ''}
                          onChange={(e) => updateAgenda(index, 'start_time', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Jam Selesai</label>
                        <input
                          type="time"
                          value={agenda.end_time || ''}
                          onChange={(e) => updateAgenda(index, 'end_time', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Lokasi</label>
                        <input
                          type="text"
                          value={agenda.location || ''}
                          onChange={(e) => updateAgenda(index, 'location', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                          placeholder="Masjid Al-Ikhlas"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Alamat</label>
                        <input
                          type="text"
                          value={agenda.address || ''}
                          onChange={(e) => updateAgenda(index, 'address', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                          placeholder="Jl. Raya No. 123"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Banks Tab */}
        {activeTab === 'banks' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Amplop Digital</h2>
                <p className="text-sm text-gray-500">Rekening untuk menerima hadiah</p>
              </div>
              <button
                type="button"
                onClick={addBank}
                className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
              >
                <Plus size={20} />
                <span>Tambah Rekening</span>
              </button>
            </div>

            {form.banks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Belum ada rekening. Klik tombol di atas untuk menambahkan.
              </p>
            ) : (
              <div className="space-y-4">
                {form.banks.map((bank, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-700">Rekening {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeBank(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Nama Bank</label>
                        <input
                          type="text"
                          value={bank.bank}
                          onChange={(e) => updateBank(index, 'bank', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                          placeholder="BCA"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Nomor Rekening</label>
                        <input
                          type="text"
                          value={bank.account_number}
                          onChange={(e) => updateBank(index, 'account_number', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                          placeholder="1234567890"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Atas Nama</label>
                        <input
                          type="text"
                          value={bank.account_name}
                          onChange={(e) => updateBank(index, 'account_name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                          placeholder="Ahmad"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Media & Audio</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OG Image URL</label>
                <input
                  type="text"
                  name="og_image"
                  value={form.og_image}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                  placeholder="/images/og-image.jpg"
                />
                <p className="text-sm text-gray-500 mt-1">Gambar untuk preview di social media</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Favicon URL</label>
                <input
                  type="text"
                  name="favicon"
                  value={form.favicon}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                  placeholder="/images/favicon.ico"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-medium text-gray-800 mb-4">Musik Latar</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File Audio</label>
                  <input
                    type="text"
                    name="src"
                    value={form.audio.src}
                    onChange={handleAudioChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                    placeholder="/audio/music.mp3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Judul Lagu</label>
                  <input
                    type="text"
                    name="title"
                    value={form.audio.title}
                    onChange={handleAudioChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                    placeholder="Fulfilling Humming"
                  />
                </div>
              </div>

              <div className="flex gap-6 mt-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="autoplay"
                    checked={form.audio.autoplay}
                    onChange={handleAudioChange}
                    className="w-4 h-4 text-rose-500 rounded focus:ring-rose-500"
                  />
                  <span className="text-sm text-gray-700">Autoplay</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="loop"
                    checked={form.audio.loop}
                    onChange={handleAudioChange}
                    className="w-4 h-4 text-rose-500 rounded focus:ring-rose-500"
                  />
                  <span className="text-sm text-gray-700">Loop</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Galeri Foto</h2>
                <div className="flex gap-2">
                  {/* Upload button */}
                  <label className={`flex items-center gap-2 px-3 py-2 text-sm bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors cursor-pointer ${uploadingPhoto ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <Upload size={16} />
                    {uploadingPhoto ? 'Uploading...' : 'Upload Foto'}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      multiple
                      onChange={handleFileUpload}
                      disabled={uploadingPhoto}
                      className="hidden"
                    />
                  </label>
                  {/* Add URL button */}
                  <button
                    type="button"
                    onClick={addPhoto}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-rose-600 border border-rose-300 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Link size={16} />
                    Tambah URL
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                Upload foto langsung atau tambahkan URL gambar. Foto akan ditampilkan di galeri undangan.
              </p>

              {form.photos.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                  <Image className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Belum ada foto</p>
                  <div className="mt-4 flex justify-center gap-3">
                    <label className="flex items-center gap-2 px-4 py-2 text-sm bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors cursor-pointer">
                      <Upload size={16} />
                      Upload Foto
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={addPhoto}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-rose-600 border border-rose-300 rounded-lg hover:bg-rose-50"
                    >
                      <Link size={16} />
                      Tambah URL
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {form.photos.map((photo, index) => (
                    <div key={index} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center text-gray-400">
                        <GripVertical size={20} />
                      </div>

                      {/* Preview */}
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {photo.src ? (
                          <img
                            src={photo.src}
                            alt={photo.alt || `Foto ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'flex'
                            }}
                          />
                        ) : null}
                        <div className={`w-full h-full items-center justify-center ${photo.src ? 'hidden' : 'flex'}`}>
                          <Image className="text-gray-400" size={24} />
                        </div>
                      </div>

                      {/* Fields */}
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">URL Foto *</label>
                          <input
                            type="text"
                            value={photo.src}
                            onChange={(e) => updatePhoto(index, 'src', e.target.value)}
                            placeholder="https://example.com/foto.jpg"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Alt Text</label>
                          <input
                            type="text"
                            value={photo.alt}
                            onChange={(e) => updatePhoto(index, 'alt', e.target.value)}
                            placeholder="Deskripsi foto"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Caption</label>
                          <input
                            type="text"
                            value={photo.caption}
                            onChange={(e) => updatePhoto(index, 'caption', e.target.value)}
                            placeholder="Caption foto"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                          />
                        </div>
                      </div>

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors self-start"
                        title="Hapus foto"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {form.photos.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Total: {form.photos.length} foto. Foto akan ditampilkan sesuai urutan di atas.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && isEdit && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hadir</p>
                    <p className="text-2xl font-bold text-gray-800">{stats?.attending || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Users className="text-red-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tidak Hadir</p>
                    <p className="text-2xl font-bold text-gray-800">{stats?.not_attending || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Users className="text-yellow-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ragu-ragu</p>
                    <p className="text-2xl font-bold text-gray-800">{stats?.maybe || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MessageSquare className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Ucapan</p>
                    <p className="text-2xl font-bold text-gray-800">{stats?.total || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Wishes List */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Daftar Ucapan</h2>
              </div>

              {wishes.length === 0 ? (
                <div className="p-6 text-center text-gray-500">Belum ada ucapan</div>
              ) : (
                <div className="divide-y max-h-96 overflow-y-auto">
                  {wishes.map((wish) => (
                    <div key={wish.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-800">{wish.name}</p>
                          <p className="text-gray-600 mt-1">{wish.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                wish.attendance === 'ATTENDING'
                                  ? 'bg-green-100 text-green-800'
                                  : wish.attendance === 'NOT_ATTENDING'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {wish.attendance === 'ATTENDING'
                                ? 'Hadir'
                                : wish.attendance === 'NOT_ATTENDING'
                                ? 'Tidak Hadir'
                                : 'Ragu-ragu'}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(wish.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submit Button */}
        {activeTab !== 'stats' && (
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              <span>{isSaving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Buat Undangan'}</span>
            </button>
          </div>
        )}
      </form>
    </AdminLayout>
  )
}
