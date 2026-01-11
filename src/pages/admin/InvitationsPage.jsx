import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import { fetchInvitations, deleteInvitation } from '@/services/adminApi'
import { Plus, Edit, Trash2, Eye, ExternalLink, Copy, Check } from 'lucide-react'

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [copiedUid, setCopiedUid] = useState(null)

  useEffect(() => {
    loadInvitations()
  }, [])

  const loadInvitations = async () => {
    try {
      setIsLoading(true)
      const response = await fetchInvitations()
      setInvitations(response.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (uid) => {
    try {
      await deleteInvitation(uid)
      setInvitations(invitations.filter((inv) => inv.uid !== uid))
      setDeleteConfirm(null)
    } catch (err) {
      alert('Gagal menghapus: ' + err.message)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getInvitationUrl = (uid) => {
    const baseUrl = window.location.origin
    return `${baseUrl}/${uid}`
  }

  const copyToClipboard = async (uid) => {
    try {
      await navigator.clipboard.writeText(getInvitationUrl(uid))
      setCopiedUid(uid)
      setTimeout(() => setCopiedUid(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Daftar Undangan</h1>
          <p className="text-gray-600">Kelola semua undangan pernikahan</p>
        </div>
        <Link
          to="/admin/invitations/new"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
        >
          <Plus size={20} />
          <span>Buat Undangan</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Memuat data...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={loadInvitations}
            className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
          >
            Coba Lagi
          </button>
        </div>
      ) : invitations.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada undangan</h3>
          <p className="text-gray-500 mb-4">Mulai dengan membuat undangan pertama Anda</p>
          <Link
            to="/admin/invitations/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
          >
            <Plus size={20} />
            <span>Buat Undangan</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pasangan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    UID / Link
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invitations.map((invitation) => {
                  const weddingDate = invitation.weddingDate || invitation.wedding_date
                  const groomName = invitation.groomName || invitation.groom_name
                  const brideName = invitation.brideName || invitation.bride_name
                  const isPast = weddingDate ? new Date(weddingDate) < new Date() : false
                  return (
                    <tr key={invitation.uid} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {groomName} & {brideName}
                        </div>
                        {invitation.title && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {invitation.title}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {invitation.uid}
                          </code>
                          <button
                            onClick={() => copyToClipboard(invitation.uid)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Salin link"
                          >
                            {copiedUid === invitation.uid ? (
                              <Check size={16} className="text-green-500" />
                            ) : (
                              <Copy size={16} />
                            )}
                          </button>
                          <a
                            href={getInvitationUrl(invitation.uid)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Buka undangan"
                          >
                            <ExternalLink size={16} />
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {formatDate(weddingDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isPast
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {isPast ? 'Selesai' : 'Aktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={getInvitationUrl(invitation.uid)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Lihat"
                          >
                            <Eye size={18} />
                          </a>
                          <Link
                            to={`/admin/invitations/${invitation.uid}`}
                            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => setDeleteConfirm(invitation.uid)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hapus Undangan?</h3>
            <p className="text-gray-500 mb-6">
              Anda yakin ingin menghapus undangan ini? Semua data termasuk ucapan dan RSVP akan
              dihapus secara permanen.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
