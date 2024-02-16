import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserOutput, UserOutputMapper } from '../dto/user-output'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'

namespace UpdateUserUseCase {
  export type Input = {
    id: string
    name: string
  }
  export type Output = UserOutput

  export class UseCase implements DefaultUseCase<Input, Output> {
    // Injeção de dependencia
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      if (!input.name) {
        throw new BadRequestError('Name not provided')
      }
      const entity = await this.userRepository.findById(input.id)
      // A validação do update fica dentro da própria entidade
      entity.update(input.name)
      await this.userRepository.update(entity)
      return UserOutputMapper.toOutput(entity)
    }
  }
}
export default UpdateUserUseCase
