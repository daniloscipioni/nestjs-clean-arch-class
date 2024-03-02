import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { UserPrismaRepository } from '@/users/infrastructure/database/in-memory/repositories/prisma/repositories/user-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { NotFoundError } from '@/shared/infrastructure/env-config/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/entities/testing/helpers/user-data-builder'
import GetUserUseCase from '../../getuser.usecase'

describe('GetUserUseCase integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: GetUserUseCase.UseCase
  let repository: UserPrismaRepository
  let module: TestingModule

  beforeAll(async () => {
    // Cria o banco de dados
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile()
    repository = new UserPrismaRepository(prismaService as any)
  })

  beforeEach(async () => {
    sut = new GetUserUseCase.UseCase(repository)
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should throws error when entity not found', async () => {
    await expect(() => sut.execute({ id: 'fakeId' })).rejects.toThrow(
      new NotFoundError('UserModel not found using ID fakeId'),
    )
  })

  it('should returns an user', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const model = await prismaService.user.create({ data: entity.toJson() })

    const output = await sut.execute({ id: entity._id })

    expect(output).toMatchObject(model)
  })
})
