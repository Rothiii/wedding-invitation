import * as XLSX from 'xlsx'

/**
 * Excel Template columns for guest import
 */
export const GUEST_TEMPLATE_COLUMNS = [
  { key: 'name', header: 'Nama Tamu', required: true },
  { key: 'phone', header: 'No. HP', required: false },
  { key: 'email', header: 'Email', required: false },
  { key: 'maxPersons', header: 'Jumlah Orang', required: false },
]

/**
 * Generate Excel template for guest import
 * @returns {Blob} Excel file blob
 */
export function generateGuestTemplate() {
  const headers = GUEST_TEMPLATE_COLUMNS.map((col) => col.header)

  // Sample data
  const sampleData = [
    ['Budi Santoso', '08123456789', 'budi@email.com', 2],
    ['Keluarga Pak Ahmad', '08234567890', '', 5],
    ['Siti Aminah', '08345678901', 'siti@email.com', 2],
  ]

  const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleData])

  // Set column widths
  ws['!cols'] = [
    { wch: 25 }, // Nama Tamu
    { wch: 15 }, // No. HP
    { wch: 25 }, // Email
    { wch: 15 }, // Jumlah Orang
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Daftar Tamu')

  // Generate blob
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  return new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}

/**
 * Download Excel template
 */
export function downloadGuestTemplate() {
  const blob = generateGuestTemplate()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'template-daftar-tamu.xlsx'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Parse Excel file to guest array
 * @param {File} file - Excel file
 * @returns {Promise<Array>} Array of guest objects
 */
export async function parseGuestExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })

        // Get first sheet
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        if (jsonData.length < 2) {
          reject(new Error('File Excel kosong atau tidak memiliki data'))
          return
        }

        // Get headers (first row)
        const headers = jsonData[0]

        // Map headers to column keys
        const columnMap = {}
        headers.forEach((header, index) => {
          const col = GUEST_TEMPLATE_COLUMNS.find(
            (c) => c.header.toLowerCase() === header?.toString().toLowerCase()
          )
          if (col) {
            columnMap[index] = col.key
          }
        })

        // Check required columns
        const hasNameColumn = Object.values(columnMap).includes('name')
        if (!hasNameColumn) {
          reject(new Error('Kolom "Nama Tamu" tidak ditemukan'))
          return
        }

        // Parse data rows
        const guests = []
        const errors = []

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i]

          // Skip empty rows
          if (!row || row.every((cell) => !cell)) continue

          const guest = {}
          Object.entries(columnMap).forEach(([index, key]) => {
            guest[key] = row[parseInt(index)]
          })

          // Validate required fields
          if (!guest.name || guest.name.toString().trim() === '') {
            errors.push(`Baris ${i + 1}: Nama tamu kosong`)
            continue
          }

          // Clean and format data
          guests.push({
            name: guest.name.toString().trim(),
            phone: guest.phone?.toString().trim() || null,
            email: guest.email?.toString().trim() || null,
            maxPersons: parseInt(guest.maxPersons) || 2,
          })
        }

        if (errors.length > 0 && guests.length === 0) {
          reject(new Error(errors.join('\n')))
          return
        }

        resolve({ guests, errors })
      } catch (err) {
        reject(new Error('Gagal membaca file Excel: ' + err.message))
      }
    }

    reader.onerror = () => {
      reject(new Error('Gagal membaca file'))
    }

    reader.readAsArrayBuffer(file)
  })
}

/**
 * Export guests to Excel with links
 * @param {Array} guests - Array of guest objects with links
 * @param {string} invitationTitle - Title for the file
 * @returns {Blob} Excel file blob
 */
export function exportGuestsToExcel(guests, invitationTitle = 'Undangan') {
  const headers = [
    'Nama Tamu',
    'Kode',
    'Link Undangan',
    'No. HP',
    'Email',
    'Jumlah Orang',
    'Dibuka',
    'Jumlah Buka',
  ]

  const data = guests.map((guest) => [
    guest.name,
    guest.code,
    guest.link,
    guest.phone || '',
    guest.email || '',
    guest.maxPersons || 2,
    guest.linkOpenedAt ? 'Ya' : 'Belum',
    guest.linkOpenedCount || 0,
  ])

  const ws = XLSX.utils.aoa_to_sheet([headers, ...data])

  // Set column widths
  ws['!cols'] = [
    { wch: 25 }, // Nama Tamu
    { wch: 10 }, // Kode
    { wch: 50 }, // Link
    { wch: 15 }, // No. HP
    { wch: 25 }, // Email
    { wch: 12 }, // Jumlah Orang
    { wch: 10 }, // Dibuka
    { wch: 12 }, // Jumlah Buka
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Daftar Tamu')

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  return new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}

/**
 * Download guests Excel file
 * @param {Array} guests - Array of guest objects with links
 * @param {string} invitationTitle - Title for the file
 */
export function downloadGuestsExcel(guests, invitationTitle = 'Undangan') {
  const blob = exportGuestsToExcel(guests, invitationTitle)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `daftar-tamu-${invitationTitle.toLowerCase().replace(/\s+/g, '-')}.xlsx`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
