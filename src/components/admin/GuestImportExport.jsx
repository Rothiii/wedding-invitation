import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  Download,
  FileSpreadsheet,
  X,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import {
  downloadGuestTemplate,
  parseGuestExcel,
  downloadGuestsExcel,
} from '@/lib/excel'

/**
 * Guest Import Modal
 */
export function GuestImportModal({ isOpen, onClose, onImport, isLoading = false }) {
  const [file, setFile] = useState(null)
  const [parseResult, setParseResult] = useState(null)
  const [error, setError] = useState(null)
  const [isParsing, setIsParsing] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setError(null)
    setParseResult(null)
    setIsParsing(true)

    try {
      const result = await parseGuestExcel(selectedFile)
      setParseResult(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsParsing(false)
    }
  }

  const handleImport = () => {
    if (parseResult?.guests?.length > 0) {
      onImport(parseResult.guests)
    }
  }

  const handleClose = () => {
    setFile(null)
    setParseResult(null)
    setError(null)
    onClose()
  }

  const handleDownloadTemplate = () => {
    downloadGuestTemplate()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 z-50 w-full max-w-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Import Tamu dari Excel
              </h3>
              <button
                onClick={handleClose}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
              {/* Download Template */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start gap-3">
                  <FileSpreadsheet className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium">
                      Download Template Excel
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Gunakan template ini untuk memudahkan import data tamu.
                    </p>
                    <button
                      onClick={handleDownloadTemplate}
                      className="mt-2 text-sm text-blue-700 hover:text-blue-800 font-medium underline"
                    >
                      Download Template
                    </button>
                  </div>
                </div>
              </div>

              {/* File Input */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-rose-400 transition-colors text-center"
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {file ? file.name : 'Pilih file Excel atau drag & drop'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Format: .xlsx, .xls
                  </p>
                </button>
              </div>

              {/* Parsing State */}
              {isParsing && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Membaca file...</span>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {/* Parse Result */}
              {parseResult && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-green-700 font-medium">
                        {parseResult.guests.length} tamu siap diimport
                      </p>
                      {parseResult.errors?.length > 0 && (
                        <p className="text-xs text-amber-600 mt-1">
                          {parseResult.errors.length} baris dilewati karena
                          error
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="mt-3 max-h-32 overflow-y-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-left text-green-700">
                          <th className="py-1">Nama</th>
                          <th className="py-1">No. HP</th>
                          <th className="py-1">Orang</th>
                        </tr>
                      </thead>
                      <tbody className="text-green-800">
                        {parseResult.guests.slice(0, 5).map((guest, i) => (
                          <tr key={i}>
                            <td className="py-1">{guest.name}</td>
                            <td className="py-1">{guest.phone || '-'}</td>
                            <td className="py-1">{guest.maxPersons}</td>
                          </tr>
                        ))}
                        {parseResult.guests.length > 5 && (
                          <tr>
                            <td
                              colSpan={3}
                              className="py-1 text-green-600 italic"
                            >
                              ... dan {parseResult.guests.length - 5} lainnya
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleImport}
                disabled={!parseResult?.guests?.length || isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mengimport...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Import Tamu</span>
                  </>
                )}
              </button>
              <button
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/**
 * Export Guests Button
 */
export function ExportGuestsButton({
  guests,
  invitationTitle,
  disabled = false,
  className = '',
}) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      downloadGuestsExcel(guests, invitationTitle)
    } finally {
      setTimeout(() => setIsExporting(false), 500)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={disabled || isExporting || !guests?.length}
      className={`flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isExporting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      <span>Export Excel</span>
    </button>
  )
}

/**
 * Import Button
 */
export function ImportGuestsButton({ onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${className}`}
    >
      <Upload className="w-4 h-4" />
      <span>Import Excel</span>
    </button>
  )
}

export default GuestImportModal
