export interface LoginDto {
  username: string
  password: string
}

export interface LoginResponseDto {
  token: string
  expiresAt: number
}

export interface SessionDto {
  username: string
  createdAt: number
  expiresAt: number
}
