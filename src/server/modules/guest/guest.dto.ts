export interface CreateGuestDto {
  name: string
  phone?: string
  email?: string
  maxPersons?: number
}

export interface UpdateGuestDto {
  name?: string
  phone?: string
  email?: string
  maxPersons?: number
  isActive?: boolean
}

export interface GuestResponseDto {
  id: number
  invitationUid: string
  name: string
  slug: string | null
  code: string | null
  phone: string | null
  email: string | null
  maxPersons: number | null
  linkOpenedAt: Date | null
  linkOpenedCount: number | null
  isActive: boolean | null
  createdAt: Date | null
}

export interface GuestWithLinkDto extends GuestResponseDto {
  link: string
}

export interface BulkCreateGuestDto {
  guests: CreateGuestDto[]
}

export interface GuestStatsDto {
  total: number
  opened: number
  notOpened: number
}
