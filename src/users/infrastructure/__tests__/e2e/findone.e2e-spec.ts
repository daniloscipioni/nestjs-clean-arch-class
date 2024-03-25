import { UserRepository } from '@/users/domain/repositories/user.repository'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module'
import { UsersModule } from '../../users.module'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import request from 'supertest'
import { UsersController } from '../../users.controller'
import { instanceToPlain } from 'class-transformer'
import { applyGlobalConfig } from '@/global-config'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/entities/testing/helpers/user-data-builder'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { BcryptjsHashProvider } from '../../providers/hash-provider/bcryptjs-hash.provider'

describe('UsersController e2e tests', () => {
  let app: INestApplication
  let module: TestingModule
  let repository: UserRepository.Repository
  const prismaService = new PrismaClient()
  let entity: UserEntity
  let hashProvider: HashProvider
  let hashPassword: string
  let accessToken: string

  beforeAll(async () => {
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [
        EnvConfigModule,
        UsersModule,
        DatabaseModule.forTest(prismaService),
      ],
    }).compile()
    app = module.createNestApplication()
    applyGlobalConfig(app)
    await app.init()
    repository = module.get<UserRepository.Repository>('UserRepository')
    hashProvider = new BcryptjsHashProvider()
    hashPassword = await hashProvider.generateHash('1234')
  })

  beforeEach(async () => {
    await prismaService.user.deleteMany()
    entity = new UserEntity(
      UserDataBuilder({
        email: 'a@a.com',
        password: hashPassword,
      }),
    )
    await repository.insert(entity)
    const loginResponse = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: 'a@a.com', password: '1234' })
      .expect(200)

    accessToken = loginResponse.body.accessToken
  })

  describe('GET /users/:id', () => {
    it('should get a user', async () => {
      const res = await request(app.getHttpServer())
        .get(`/users/${entity._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      const presenter = UsersController.userToResponse(entity.toJson())
      const serialized = instanceToPlain(presenter)

      expect(res.body.data).toStrictEqual(serialized)
    })

    it('should return error with 401 code when the request is not authorized passing fake token', async () => {
      const res = await request(app.getHttpServer())
        .get(`/users/fakeId`)
        .set('Authorization', `Bearer FakeToken`)
        .expect(401)
        .expect({ message: 'Unauthorized', statusCode: 401 })
    })

    it('should return error with 401 code when the request is not authorized not setting Authorization', async () => {
      const res = await request(app.getHttpServer())
        .get(`/users/fakeId`)
        .expect(401)
        .expect({ message: 'Unauthorized', statusCode: 401 })
    })
  })
})
