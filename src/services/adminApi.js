const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const TOKEN_KEY = 'admin_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

async function authFetch(url, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers
  })

  if (response.status === 401) {
    removeToken()
    window.location.href = '/admin'
    throw new Error('Session expired')
  }

  return response
}

export async function login(username, password) {
  const response = await fetch(`${API_URL}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Login failed')
  }

  if (data.success && data.data?.token) {
    setToken(data.data.token)
  }

  return data
}

export async function logout() {
  try {
    await authFetch(`${API_URL}/api/admin/auth/logout`, { method: 'POST' })
  } finally {
    removeToken()
  }
}

export async function verifyToken() {
  const token = getToken()
  if (!token) return false

  try {
    const response = await authFetch(`${API_URL}/api/admin/auth/verify`)
    const data = await response.json()
    return data.success
  } catch {
    return false
  }
}

export async function fetchInvitations() {
  const response = await authFetch(`${API_URL}/api/admin/invitations`)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch invitations')
  }

  return data
}

export async function fetchInvitation(uid) {
  const response = await authFetch(`${API_URL}/api/admin/invitations/${uid}`)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch invitation')
  }

  return data
}

export async function createInvitation(invitationData) {
  const response = await authFetch(`${API_URL}/api/admin/invitations`, {
    method: 'POST',
    body: JSON.stringify(invitationData)
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to create invitation')
  }

  return data
}

export async function updateInvitation(uid, invitationData) {
  const response = await authFetch(`${API_URL}/api/admin/invitations/${uid}`, {
    method: 'PUT',
    body: JSON.stringify(invitationData)
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to update invitation')
  }

  return data
}

export async function deleteInvitation(uid) {
  const response = await authFetch(`${API_URL}/api/admin/invitations/${uid}`, {
    method: 'DELETE'
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete invitation')
  }

  return data
}

export async function fetchThemes() {
  const response = await authFetch(`${API_URL}/api/admin/themes`)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch themes')
  }

  return data
}

export async function fetchWishesAdmin(uid) {
  const response = await authFetch(`${API_URL}/api/${uid}/wishes?limit=1000`)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch wishes')
  }

  return data
}

export async function fetchStatsAdmin(uid) {
  const response = await authFetch(`${API_URL}/api/${uid}/stats`)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch stats')
  }

  return data
}

// Photo Gallery APIs
export async function fetchPhotos(uid) {
  const response = await authFetch(`${API_URL}/api/admin/invitations/${uid}/photos`)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch photos')
  }

  return data
}

export async function savePhotos(uid, photos) {
  const response = await authFetch(`${API_URL}/api/admin/invitations/${uid}/photos/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ photos })
  })
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to save photos')
  }

  return data
}

export async function deletePhoto(id) {
  const response = await authFetch(`${API_URL}/api/admin/photos/${id}`, {
    method: 'DELETE'
  })
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete photo')
  }

  return data
}
