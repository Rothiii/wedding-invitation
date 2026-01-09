export type AttendanceStatus = 'ATTENDING' | 'NOT_ATTENDING' | 'MAYBE'

export interface CreateWishDto {
  name: string
  message: string
  attendance?: AttendanceStatus
  guestId?: number
}

export interface WishResponseDto {
  id: number
  invitationUid: string
  guestId: number | null
  name: string
  message: string
  attendance: string | null
  createdAt: Date | null
}

export interface WishStatsDto {
  total: number
  attending: number
  notAttending: number
  maybe: number
}

export interface PaginatedWishesDto {
  wishes: WishResponseDto[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
