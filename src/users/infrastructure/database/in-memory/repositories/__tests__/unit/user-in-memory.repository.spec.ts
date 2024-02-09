import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserInMemoryRepository } from '../../user-in-memory.repository'
import { UserDataBuilder } from '@/users/domain/entities/testing/helpers/user-data-builder'
import { NotFoundError } from 'rxjs'
import { ConflictError } from '@/shared/infrastructure/env-config/domain/errors/conflict-error'

describe('UserInMemoryRepository unit tests', () => {
  let sut: UserInMemoryRepository
  beforeEach(() => {
    sut = new UserInMemoryRepository()
  })
  it('Should throw error when not find - findByEmail method', async () => {
    await expect(sut.findByEmail('a@a.com')).rejects.toThrow(
      new NotFoundError('Entity not found using email a@a.com'),
    )
  })

  it('Should find a entity by email - findByEmail method', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)
    const result = await sut.findByEmail(entity.email)
    expect(entity.toJson()).toStrictEqual(result.toJson())
  })

  it('Should throw error when not find - emailExists method', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)
    await expect(sut.emailExists(entity.email)).rejects.toThrow(
      new ConflictError('Email address is already in use'),
    )
  })

  it('Should find a entity by email - emailExists method', async () => {
    expect.assertions(0)
    await sut.emailExists('a@a.com')
  })

  it('Should no filter items when filter object is null', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)
    const result = await sut.findAll()
    const itemsFiltered = await sut['applyFilter'](result, null)

    const spyFilter = jest.spyOn(result, 'filter')
    expect(spyFilter).not.toHaveBeenCalled()
    expect(itemsFiltered).toStrictEqual(result)
  })

  it('Should filter name field using filter param', async () => {
    const items = [
      new UserEntity(UserDataBuilder({ name: 'Test' })),
      new UserEntity(UserDataBuilder({ name: 'TEST' })),
      new UserEntity(UserDataBuilder({ name: 'fake' })),
    ]

    const spyFilter = jest.spyOn(items, 'filter')
    const itemsFiltered = await sut['applyFilter'](items, 'TEST')
    expect(spyFilter).toHaveBeenCalled()
    expect(itemsFiltered).toStrictEqual([items[0], items[1]])
  })

  it('Should sort by createdAt when sort is null', async () => {
    const createdAt = new Date()
    const items = [
      new UserEntity(UserDataBuilder({ name: 'Test', createdAt })),
      new UserEntity(
        UserDataBuilder({
          name: 'TEST',
          createdAt: new Date(createdAt.getTime() + 1),
        }),
      ),
      new UserEntity(
        UserDataBuilder({
          name: 'fake',
          createdAt: new Date(createdAt.getTime() + 2),
        }),
      ),
    ]

    const itemsSorted = await sut['applySort'](items, null, null)

    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]])
  })

  it('Should sort by name field', async () => {
    const items = [
      new UserEntity(UserDataBuilder({ name: 'c' })),
      new UserEntity(UserDataBuilder({ name: 'd' })),
      new UserEntity(UserDataBuilder({ name: 'a' })),
    ]

    let itemsSorted = await sut['applySort'](items, 'name', 'asc')
    expect(itemsSorted).toStrictEqual([items[2], items[0], items[1]])
    itemsSorted = await sut['applySort'](items, 'name', null)
    expect(itemsSorted).toStrictEqual([items[1], items[0], items[2]])
  })
})
