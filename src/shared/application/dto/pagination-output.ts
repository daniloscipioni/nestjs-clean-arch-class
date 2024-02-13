import { Entity } from '@/shared/infrastructure/env-config/domain/entities/entity'
import { SearchResult } from '@/shared/infrastructure/env-config/domain/repositories/searchable-repository-contracts'

export type PaginationOutput<Item = any> = {
  items: Item[]
  total: number
  currentPage: number
  lastPage: number
  perPage: number
}

export class PaginationOutputMapper {
  static toOutput<Item = any>(
    items: Item[],
    result: SearchResult<Entity>,
  ): PaginationOutput<Item> {
    return {
      items,
      total: result.total,
      currentPage: result.currentPage,
      lastPage: result.lastPage,
      perPage: result.perPage,
    }
  }
}
