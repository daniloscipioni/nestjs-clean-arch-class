import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { SearchInput } from '@/shared/application/dto/search-input'

namespace ListUsersUseCase {
  export type Input = SearchInput
  export type Output = void

  export class UseCase implements DefaultUseCase<Input, Output> {
    // Injeção de dependencia
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const params = new UserRepository.SearchParams(input)
      const searchResult = await this.userRepository.search(params)
      return
    }
  }
}
export default ListUsersUseCase
