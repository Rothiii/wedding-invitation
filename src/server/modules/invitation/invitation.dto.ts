import type { AudioConfig } from '../../infra/database/schema'

export interface CreateAgendaDto {
  title: string
  date: string
  startTime?: string
  endTime?: string
  location?: string
  address?: string
  orderIndex?: number
}

export interface CreateBankDto {
  bank: string
  accountNumber: string
  accountName: string
  orderIndex?: number
}

export interface CreateInvitationDto {
  uid: string
  groomName: string
  brideName: string
  weddingDate: string
  title?: string
  description?: string
  parentGroom?: string
  parentBride?: string
  time?: string
  location?: string
  address?: string
  mapsUrl?: string
  mapsEmbed?: string
  ogImage?: string
  favicon?: string
  audio?: AudioConfig
  theme?: string
  guestMode?: 'public' | 'private'
  agenda?: CreateAgendaDto[]
  banks?: CreateBankDto[]
}

export interface UpdateInvitationDto {
  title?: string
  description?: string
  groomName?: string
  brideName?: string
  parentGroom?: string
  parentBride?: string
  weddingDate?: string
  time?: string
  location?: string
  address?: string
  mapsUrl?: string
  mapsEmbed?: string
  ogImage?: string
  favicon?: string
  audio?: AudioConfig
  theme?: string
  guestMode?: 'public' | 'private'
  isActive?: boolean
  agenda?: CreateAgendaDto[]
  banks?: CreateBankDto[]
}

export interface AgendaResponseDto {
  id: number
  title: string
  date: string
  startTime: string | null
  endTime: string | null
  location: string | null
  address: string | null
  orderIndex: number
}

export interface BankResponseDto {
  id: number
  bank: string
  accountNumber: string
  accountName: string
  orderIndex: number
}

export interface InvitationResponseDto {
  uid: string
  title: string
  description: string | null
  groomName: string
  brideName: string
  parentGroom: string | null
  parentBride: string | null
  weddingDate: string
  time: string | null
  location: string | null
  address: string | null
  mapsUrl: string | null
  mapsEmbed: string | null
  ogImage: string | null
  favicon: string | null
  audio: AudioConfig | null
  theme: string | null
  guestMode: string | null
  isActive: boolean | null
  createdAt: Date | null
  updatedAt: Date | null
  agenda?: AgendaResponseDto[]
  banks?: BankResponseDto[]
}

export interface InvitationListResponseDto {
  uid: string
  title: string
  groomName: string
  brideName: string
  weddingDate: string
  theme: string | null
  isActive: boolean | null
  createdAt: Date | null
}
