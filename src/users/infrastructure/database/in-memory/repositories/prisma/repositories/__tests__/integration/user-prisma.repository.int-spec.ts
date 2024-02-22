import { PrismaClient } from '@prisma/client'
import { UserPrismaRepository } from '../../user-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { NotFoundError } from '@/shared/infrastructure/env-config/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/entities/testing/helpers/user-data-builder'

describe('UserPrismaRepository integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: UserPrismaRepository
  let module: TestingModule

  beforeAll(async () => {
    // Cria o banco de dados
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile()
  })

  beforeEach(async () => {
    sut = new UserPrismaRepository(prismaService as any)
    await prismaService.user.deleteMany()
  })

  it('should throws error when entity not found', async () => {
    expect(() => sut.findById('FakeId')).rejects.toThrow(
      new NotFoundError('UserModel not found using ID FakeId'),
    )
  })

  it('should find a entity by id', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const newUser = await prismaService.user.create({ data: entity.toJson() })

    const output = await sut.findById(newUser.id)

    expect(output.toJson()).toStrictEqual(entity.toJson())
  })

  it('should insert a new entity', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)

    const result = await prismaService.user.findUnique({
      where: {
        id: entity._id,
      },
    })

    expect(result).toStrictEqual(entity.toJson())
  })

  it('should return all users', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const newUser = await prismaService.user.create({ data: entity.toJson() })

    const entities = await sut.findAll()
    //Duas formas de fazer a mesma validação
    expect(entities).toHaveLength(1)
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]))
    //
    entities.map(item => expect(item.toJson()).toStrictEqual(entity.toJson()))
  })
})
