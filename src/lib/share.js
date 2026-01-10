import QRCode from 'qrcode'

/**
 * Generate QR Code as data URL
 * @param {string} url - URL to encode
 * @param {object} options - QR Code options
 * @returns {Promise<string>} Data URL of QR code image
 */
export async function generateQRCode(url, options = {}) {
  const defaultOptions = {
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
    ...options,
  }

  return QRCode.toDataURL(url, defaultOptions)
}

/**
 * Generate QR Code as canvas
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {string} url - URL to encode
 * @param {object} options - QR Code options
 */
export async function generateQRCodeCanvas(canvas, url, options = {}) {
  const defaultOptions = {
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
    ...options,
  }

  return QRCode.toCanvas(canvas, url, defaultOptions)
}

/**
 * Download QR Code as image
 * @param {string} url - URL to encode
 * @param {string} filename - Filename without extension
 */
export async function downloadQRCode(url, filename = 'qrcode') {
  const dataUrl = await generateQRCode(url, { width: 500 })
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = `${filename}.png`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }

    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-9999px'
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    return true
  } catch (err) {
    console.error('Failed to copy:', err)
    return false
  }
}

/**
 * Generate invitation link
 * @param {string} baseUrl - Base URL
 * @param {string} invitationUid - Invitation UID
 * @param {object} guest - Guest object (optional)
 * @returns {string} Full invitation link
 */
export function generateInvitationLink(baseUrl, invitationUid, guest = null) {
  const url = new URL(`${baseUrl}/${invitationUid}`)

  if (guest) {
    if (guest.code) {
      // Private mode
      url.searchParams.set('g', guest.code)
    } else if (guest.name) {
      // Public mode
      url.searchParams.set('to', guest.name)
    }
  }

  return url.toString()
}

/**
 * Generate WhatsApp share URL
 * @param {string} phone - Phone number (optional, for direct message)
 * @param {string} message - Message text
 * @returns {string} WhatsApp URL
 */
export function generateWhatsAppUrl(phone = null, message) {
  const encodedMessage = encodeURIComponent(message)

  if (phone) {
    // Remove non-numeric characters and ensure country code
    let cleanPhone = phone.replace(/\D/g, '')
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1)
    }
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
  }

  return `https://wa.me/?text=${encodedMessage}`
}

/**
 * Generate WhatsApp invitation message
 * @param {object} config - Invitation config
 * @param {string} link - Invitation link
 * @param {string} guestName - Guest name
 * @returns {string} Formatted message
 */
export function generateWhatsAppMessage(config, link, guestName = null) {
  const greeting = guestName ? `Kepada Yth. *${guestName}*,\n\n` : ''

  return `${greeting}Bismillahirrahmanirrahim

Assalamu'alaikum Warahmatullahi Wabarakatuh

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:

*${config.groomName} & ${config.brideName}*

Untuk info lebih lengkap, silakan kunjungi:
${link}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.

Wassalamu'alaikum Warahmatullahi Wabarakatuh

Terima kasih.`
}

/**
 * Share via Web Share API (if available)
 * @param {object} shareData - Share data (title, text, url)
 * @returns {Promise<boolean>} Success status
 */
export async function shareViaWebShare(shareData) {
  if (navigator.share) {
    try {
      await navigator.share(shareData)
      return true
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share failed:', err)
      }
      return false
    }
  }
  return false
}

/**
 * Open share dialog or WhatsApp
 * @param {object} config - Invitation config
 * @param {string} link - Invitation link
 * @param {string} guestName - Guest name
 * @param {string} phone - Phone number (optional)
 */
export function shareToWhatsApp(config, link, guestName = null, phone = null) {
  const message = generateWhatsAppMessage(config, link, guestName)
  const url = generateWhatsAppUrl(phone, message)
  window.open(url, '_blank')
}
