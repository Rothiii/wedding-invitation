import {
  SiteSettingsRepository,
  TestimonialRepository,
  PackageRepository,
} from './site.repository'
import { NotFoundError, ValidationError } from '../../shared/errors'
import type {
  SiteSettingDto,
  TestimonialDto,
  PackageDto,
  CreateTestimonialDto,
  UpdateTestimonialDto,
  CreatePackageDto,
  UpdatePackageDto,
} from './site.dto'
import type { Testimonial, Package } from '../../infra/database/schema'

export class SiteService {
  private settingsRepo: SiteSettingsRepository
  private testimonialRepo: TestimonialRepository
  private packageRepo: PackageRepository

  constructor() {
    this.settingsRepo = new SiteSettingsRepository()
    this.testimonialRepo = new TestimonialRepository()
    this.packageRepo = new PackageRepository()
  }

  // Site Settings
  async getSetting(key: string): Promise<unknown> {
    const setting = await this.settingsRepo.get(key)
    return setting?.value ?? null
  }

  async getAllSettings(): Promise<Record<string, unknown>> {
    const settings = await this.settingsRepo.getAll()
    const result: Record<string, unknown> = {}

    for (const setting of settings) {
      result[setting.key] = setting.value
    }

    return result
  }

  async setSetting(key: string, value: unknown): Promise<SiteSettingDto> {
    if (!key || typeof key !== 'string') {
      throw new ValidationError('key is required')
    }

    const setting = await this.settingsRepo.set(key, value)
    return { key: setting.key, value: setting.value }
  }

  async setMultipleSettings(
    settings: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    const result: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(settings)) {
      await this.settingsRepo.set(key, value)
      result[key] = value
    }

    return result
  }

  async deleteSetting(key: string): Promise<void> {
    const deleted = await this.settingsRepo.delete(key)
    if (!deleted) {
      throw new NotFoundError('Setting not found')
    }
  }

  // Testimonials
  async getTestimonials(activeOnly: boolean = false): Promise<TestimonialDto[]> {
    const testimonials = await this.testimonialRepo.findAll(activeOnly)
    return testimonials.map(this.toTestimonialDto)
  }

  async createTestimonial(data: CreateTestimonialDto): Promise<TestimonialDto> {
    if (!data.name || !data.message) {
      throw new ValidationError('name and message are required')
    }

    const testimonial = await this.testimonialRepo.create({
      name: data.name,
      photo: data.photo || null,
      message: data.message,
      rating: data.rating ?? 5,
      orderIndex: data.orderIndex ?? 0,
    })

    return this.toTestimonialDto(testimonial)
  }

  async updateTestimonial(
    id: number,
    data: UpdateTestimonialDto
  ): Promise<TestimonialDto> {
    const existing = await this.testimonialRepo.findById(id)
    if (!existing) {
      throw new NotFoundError('Testimonial not found')
    }

    const updated = await this.testimonialRepo.update(id, {
      name: data.name,
      photo: data.photo,
      message: data.message,
      rating: data.rating,
      isActive: data.isActive,
      orderIndex: data.orderIndex,
    })

    return this.toTestimonialDto(updated!)
  }

  async deleteTestimonial(id: number): Promise<void> {
    const deleted = await this.testimonialRepo.delete(id)
    if (!deleted) {
      throw new NotFoundError('Testimonial not found')
    }
  }

  // Packages
  async getPackages(activeOnly: boolean = false): Promise<PackageDto[]> {
    const packages = await this.packageRepo.findAll(activeOnly)
    return packages.map(this.toPackageDto)
  }

  async createPackage(data: CreatePackageDto): Promise<PackageDto> {
    if (!data.name || data.price === undefined) {
      throw new ValidationError('name and price are required')
    }

    const pkg = await this.packageRepo.create({
      name: data.name,
      price: data.price,
      features: data.features || null,
      isBestSeller: data.isBestSeller ?? false,
      orderIndex: data.orderIndex ?? 0,
    })

    return this.toPackageDto(pkg)
  }

  async updatePackage(id: number, data: UpdatePackageDto): Promise<PackageDto> {
    const existing = await this.packageRepo.findById(id)
    if (!existing) {
      throw new NotFoundError('Package not found')
    }

    const updated = await this.packageRepo.update(id, {
      name: data.name,
      price: data.price,
      features: data.features,
      isBestSeller: data.isBestSeller,
      isActive: data.isActive,
      orderIndex: data.orderIndex,
    })

    return this.toPackageDto(updated!)
  }

  async deletePackage(id: number): Promise<void> {
    const deleted = await this.packageRepo.delete(id)
    if (!deleted) {
      throw new NotFoundError('Package not found')
    }
  }

  private toTestimonialDto(testimonial: Testimonial): TestimonialDto {
    return {
      id: testimonial.id,
      name: testimonial.name,
      photo: testimonial.photo,
      message: testimonial.message,
      rating: testimonial.rating,
      orderIndex: testimonial.orderIndex,
    }
  }

  private toPackageDto(pkg: Package): PackageDto {
    return {
      id: pkg.id,
      name: pkg.name,
      price: pkg.price,
      features: pkg.features,
      isBestSeller: pkg.isBestSeller,
      orderIndex: pkg.orderIndex,
    }
  }
}
