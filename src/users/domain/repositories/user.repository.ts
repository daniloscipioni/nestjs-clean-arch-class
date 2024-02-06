import { UserEntity } from '../entities/user.entity'
import { SearchableRepositoryInterface } from '@/shared/infrastructure/env-config/domain/repositories/searchable-repository-contracts'

export interface UserRepository
  extends SearchableRepositoryInterface<UserEntity, any, any> {
  findByEmail(email: string): Promise<UserEntity>
  emailExists(email: string): Promise<void>
}
