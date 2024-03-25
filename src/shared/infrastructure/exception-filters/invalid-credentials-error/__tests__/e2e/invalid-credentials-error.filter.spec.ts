import { Controller, Get, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { InvalidCredentialsErrorFilter } from '../../invalid-credentials-error.filter'
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error'

@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new InvalidCredentialsError('Invalid credentials')
  }
}

describe('InvalidCredentialsErrorFilter e2e tests', () => {
  let app: INestApplication
  let module: TestingModule

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [StubController],
    }).compile()
    app = module.createNestApplication()
    app.useGlobalFilters(new InvalidCredentialsErrorFilter())
    await app.init()
  })

  it('should catch a InvalidCredentialsError', () => {
    return request(app.getHttpServer()).get('/stub').expect(400).expect({
      status: 400,
      error: 'Bad Request',
      message: 'Invalid credentials',
    })
  })
})
