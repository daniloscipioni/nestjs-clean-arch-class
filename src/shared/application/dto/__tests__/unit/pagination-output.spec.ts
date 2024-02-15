import { SearchResult } from '@/shared/infrastructure/env-config/domain/repositories/searchable-repository-contracts'
import { PaginationOutputMapper } from '../../pagination-output'

describe('PaginationOutputMapper unit tests', () => {
  it('should convert a SearchResult in output', () => {
    const result = new SearchResult({
      items: ['fake'] as any,
      total: 1,
      currentPage: 1,
      perPage: 1,
      sort: '',
      sortDir: '',
      filter: 'fake',
    })

    const sut = PaginationOutputMapper.toOutput(result.items, result)

    expect(sut).toStrictEqual({
      items: ['fake'],
      total: result.total,
      currentPage: result.currentPage,
      perPage: result.perPage,
      sort: result.sort,
      sortDir: result.sortDir,
      filter: result.filter,
    })
  })
})
