import { UserModelMapper } from '../../user-model.mapper'
import { ValidationError } from '@/shared/infrastructure/env-config/domain/errors/validation-error'
import { PrismaClient, User } from '@prisma/client'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'

describe('UserModelMapper integration tests', () => {
  let prismaService: PrismaClient
  let props: any

  beforeAll(async () => {
    // Cria o banco de dados
    setupPrismaTests()
    prismaService = new PrismaClient()
    await prismaService.$connect
  })

  beforeEach(async () => {
    await prismaService.user.deleteMany()
    props = {
      id: 'a30eb3c5-c9b3-4e04-9435-9cbfa4c8f792',
      name: 'Test name',
      email: 'a@a.com',
      password: 'TestPassword123',
      createdAt: new Date(),
    }
  })

  afterAll(async () => {
    await prismaService.$disconnect
  })

  it('should throws error when user model is invalid', async () => {
    const model: User = Object.assign(props, { name: null })
    expect(() => UserModelMapper.toEntity(model)).toThrowError(ValidationError)
  })

  it('should convert a user model to a user entity', async () => {
    const model: User = await prismaService.user.create({
      data: props,
    })
    const sut = UserModelMapper.toEntity(model)
    expect(sut).toBeInstanceOf(UserEntity)
    expect(sut.toJson()).toStrictEqual(props)
  })
})
