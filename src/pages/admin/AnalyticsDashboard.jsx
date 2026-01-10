import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import {
  fetchInvitations,
  fetchStatsAdmin,
  fetchWishesAdmin,
} from '@/services/adminApi'
import {
  BarChart3,
  Users,
  Eye,
  MessageCircle,
  TrendingUp,
  Calendar,
  ChevronLeft,
  Check,
  X,
  HelpCircle,
  ExternalLink,
  RefreshCw,
} from 'lucide-react'

// Simple line chart component
function SimpleLineChart({ data, color = '#f43f5e' }) {
  if (!data || data.length === 0) return null

  const max = Math.max(...data.map((d) => d.value))
  const min = 0
  const range = max - min || 1

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 100
      const y = 100 - ((d.value - min) / range) * 100
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className="relative h-32">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * 100
          const y = 100 - ((d.value - min) / range) * 100
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill={color}
              className="cursor-pointer"
            />
          )
        })}
      </svg>
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        {data.map((d, i) => (
          <span key={i}>{d.label}</span>
        ))}
      </div>
    </div>
  )
}

// Donut chart component
function DonutChart({ data, size = 120 }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  let currentAngle = 0

  const segments = data.map((d) => {
    const angle = total > 0 ? (d.value / total) * 360 : 0
    const startAngle = currentAngle
    currentAngle += angle

    const x1 = 50 + 40 * Math.cos((Math.PI * (startAngle - 90)) / 180)
    const y1 = 50 + 40 * Math.sin((Math.PI * (startAngle - 90)) / 180)
    const x2 = 50 + 40 * Math.cos((Math.PI * (startAngle + angle - 90)) / 180)
    const y2 = 50 + 40 * Math.sin((Math.PI * (startAngle + angle - 90)) / 180)

    const largeArc = angle > 180 ? 1 : 0

    return {
      ...d,
      path:
        angle > 0
          ? `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`
          : '',
    }
  })

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox="0 0 100 100">
        {segments.map(
          (segment, i) =>
            segment.path && (
              <path key={i} d={segment.path} fill={segment.color} />
            )
        )}
        <circle cx="50" cy="50" r="25" fill="white" />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-lg font-bold"
          fill="#374151"
        >
          {total}
        </text>
      </svg>
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            <span className="text-gray-600">{d.label}</span>
            <span className="font-medium">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AnalyticsDashboard() {
  const { uid } = useParams()
  const [invitations, setInvitations] = useState([])
  const [selectedInvitation, setSelectedInvitation] = useState(null)
  const [stats, setStats] = useState(null)
  const [wishes, setWishes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadInvitations()
  }, [])

  useEffect(() => {
    if (uid) {
      loadInvitationData(uid)
    } else if (selectedInvitation) {
      loadInvitationData(selectedInvitation.uid)
    }
  }, [uid, selectedInvitation])

  const loadInvitations = async () => {
    try {
      const response = await fetchInvitations()
      setInvitations(response.data || [])
      if (!uid && response.data?.length > 0) {
        setSelectedInvitation(response.data[0])
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const loadInvitationData = async (invitationUid) => {
    setIsRefreshing(true)
    try {
      const [statsRes, wishesRes] = await Promise.all([
        fetchStatsAdmin(invitationUid).catch(() => ({ data: null })),
        fetchWishesAdmin(invitationUid).catch(() => ({ data: [] })),
      ])
      setStats(statsRes.data)
      setWishes(wishesRes.data || [])
    } catch (err) {
      console.error('Error loading data:', err)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleRefresh = () => {
    const currentUid = uid || selectedInvitation?.uid
    if (currentUid) {
      loadInvitationData(currentUid)
    }
  }

  // Calculate analytics data
  const attendanceData = [
    {
      label: 'Hadir',
      value: wishes.filter((w) => w.attendance === 'ATTENDING').length,
      color: '#22c55e',
    },
    {
      label: 'Tidak Hadir',
      value: wishes.filter((w) => w.attendance === 'NOT_ATTENDING').length,
      color: '#ef4444',
    },
    {
      label: 'Ragu',
      value: wishes.filter((w) => w.attendance === 'MAYBE').length,
      color: '#f59e0b',
    },
  ]

  // Generate mock daily views data (last 7 days)
  const today = new Date()
  const viewsData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today)
    date.setDate(date.getDate() - (6 - i))
    return {
      label: date.toLocaleDateString('id-ID', { weekday: 'short' }),
      value: Math.floor(Math.random() * 50) + 10,
    }
  })

  const currentInvitation = uid
    ? invitations.find((inv) => inv.uid === uid)
    : selectedInvitation

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <Link
            to="/admin/dashboard"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
            <p className="text-gray-600">Statistik undangan dan tamu</p>
          </div>
        </div>

        {/* Invitation Selector */}
        {!uid && invitations.length > 0 && (
          <div className="mt-4">
            <select
              value={selectedInvitation?.uid || ''}
              onChange={(e) => {
                const inv = invitations.find((i) => i.uid === e.target.value)
                setSelectedInvitation(inv)
              }}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
              {invitations.map((inv) => (
                <option key={inv.uid} value={inv.uid}>
                  {inv.groom_name} & {inv.bride_name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>
      )}

      {currentInvitation ? (
        <>
          {/* Invitation Info Bar */}
          <div className="bg-white rounded-lg shadow p-4 mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-800">
                {currentInvitation.groom_name} & {currentInvitation.bride_name}
              </h2>
              <p className="text-sm text-gray-500">
                {new Date(currentInvitation.wedding_date).toLocaleDateString(
                  'id-ID',
                  {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  }
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-5 h-5 text-gray-600 ${
                    isRefreshing ? 'animate-spin' : ''
                  }`}
                />
              </button>
              <a
                href={`/${currentInvitation.uid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-sm bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Lihat Undangan
              </a>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Views</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats?.totalViews || viewsData.reduce((a, b) => a + b.value, 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Tamu</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats?.totalGuests || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Ucapan</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {wishes.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Response Rate</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats?.totalGuests
                      ? Math.round((wishes.length / stats.totalGuests) * 100)
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Views Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">
                  Views (7 Hari Terakhir)
                </h3>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>
              <SimpleLineChart data={viewsData} />
            </div>

            {/* Attendance Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Konfirmasi Kehadiran</h3>
                <Users className="w-5 h-5 text-gray-400" />
              </div>
              <DonutChart data={attendanceData} />
            </div>
          </div>

          {/* Recent Wishes */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Ucapan Terbaru</h3>
              <span className="text-sm text-gray-500">{wishes.length} ucapan</span>
            </div>

            {wishes.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Belum ada ucapan</p>
              </div>
            ) : (
              <div className="divide-y max-h-96 overflow-y-auto">
                {wishes.slice(0, 10).map((wish, i) => (
                  <div key={i} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                        <span className="text-rose-600 font-medium">
                          {wish.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-800">
                            {wish.name}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              wish.attendance === 'ATTENDING'
                                ? 'bg-green-100 text-green-700'
                                : wish.attendance === 'NOT_ATTENDING'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {wish.attendance === 'ATTENDING' && (
                              <Check className="w-3 h-3 inline mr-1" />
                            )}
                            {wish.attendance === 'NOT_ATTENDING' && (
                              <X className="w-3 h-3 inline mr-1" />
                            )}
                            {wish.attendance === 'MAYBE' && (
                              <HelpCircle className="w-3 h-3 inline mr-1" />
                            )}
                            {wish.attendance === 'ATTENDING'
                              ? 'Hadir'
                              : wish.attendance === 'NOT_ATTENDING'
                              ? 'Tidak'
                              : 'Ragu'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {wish.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {wish.created_at &&
                            new Date(wish.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {wishes.length > 10 && (
              <div className="p-4 border-t text-center">
                <Link
                  to={`/admin/invitations/${currentInvitation.uid}`}
                  className="text-sm text-rose-600 hover:text-rose-700"
                >
                  Lihat semua ucapan →
                </Link>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Tidak Ada Undangan
          </h3>
          <p className="text-gray-500 mb-4">
            Buat undangan pertama untuk melihat analytics
          </p>
          <Link
            to="/admin/invitations/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
          >
            Buat Undangan
          </Link>
        </div>
      )}
    </AdminLayout>
  )
}
