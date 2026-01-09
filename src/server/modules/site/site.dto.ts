export interface SiteSettingDto {
  key: string
  value: unknown
}

export interface HeroSettingsDto {
  headline: string
  subheadline: string
  backgroundImage?: string
}

export interface TrustSignalDto {
  label: string
  value: string
}

export interface ContactSettingsDto {
  whatsapp: string
  email: string
  operationalHours: string
}

export interface SocialMediaDto {
  instagram?: string
  tiktok?: string
  facebook?: string
}

export interface FaqItemDto {
  question: string
  answer: string
}

export interface TestimonialDto {
  id: number
  name: string
  photo: string | null
  message: string
  rating: number | null
  orderIndex: number | null
}

export interface PackageDto {
  id: number
  name: string
  price: number
  features: string[] | null
  isBestSeller: boolean | null
  orderIndex: number | null
}

export interface CreateTestimonialDto {
  name: string
  photo?: string
  message: string
  rating?: number
  orderIndex?: number
}

export interface UpdateTestimonialDto {
  name?: string
  photo?: string
  message?: string
  rating?: number
  isActive?: boolean
  orderIndex?: number
}

export interface CreatePackageDto {
  name: string
  price: number
  features?: string[]
  isBestSeller?: boolean
  orderIndex?: number
}

export interface UpdatePackageDto {
  name?: string
  price?: number
  features?: string[]
  isBestSeller?: boolean
  isActive?: boolean
  orderIndex?: number
}
