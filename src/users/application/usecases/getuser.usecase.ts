import { UserRepository } from '@/users/domain/repositories/user.repository'

namespace GetUserUseCase {
  export type Input = {
    id: string
  }
  export type Output = {
    id: string
    name: string
    email: string
    password: string
    createdAt: Date
  }

  export class UseCase {
    // Injeção de dependencia
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.userRepository.findById(input.id)
      return entity.toJson()
    }
  }
}
export default GetUserUseCase
