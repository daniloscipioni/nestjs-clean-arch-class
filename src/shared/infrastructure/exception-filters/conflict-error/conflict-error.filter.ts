import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { ConflictError } from '../../env-config/domain/errors/conflict-error'
import { FastifyReply } from 'fastify'

@Catch(ConflictError)
export class ConflictErrorFilter<T> implements ExceptionFilter {
  catch(exception: ConflictError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    response.status(409).send({
      status: 409,
      error: 'Conflict',
      message: exception.message,
    })
  }
}
