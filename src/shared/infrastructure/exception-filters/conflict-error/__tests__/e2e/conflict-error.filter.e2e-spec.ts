import { Controller, Get, INestApplication } from '@nestjs/common'
import { ConflictErrorFilter } from '../../conflict-error.filter'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { ConflictError } from '@/shared/infrastructure/env-config/domain/errors/conflict-error'

@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new ConflictError('Conflicting data')
  }
}

describe('ConflictErrorFilter (e2e)', () => {
  let app: INestApplication
  let module: TestingModule

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [StubController],
    }).compile()
    app = module.createNestApplication()
    app.useGlobalFilters(new ConflictErrorFilter())
    await app.init()
  })

  it('should catch a ConflictError', () => {
    return request(app.getHttpServer()).get('/stub').expect(409).expect({
      status: 409,
      error: 'Conflict',
      message: 'Conflicting data',
    })
  })
})
