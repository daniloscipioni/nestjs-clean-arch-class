import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { SignupUseCase } from '../application/usecases/signup.usecase'
import { UserInMemoryRepository } from './database/in-memory/repositories/user-in-memory.repository'
import { BcryptjsHashProvider } from './providers/hash-provider/bcryptjs-hash.provider'
import { UserRepository } from '../domain/repositories/user.repository'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { SigninUseCase } from '../application/usecases/signin.usecase'
import GetUserUseCase from '../application/usecases/getuser.usecase'
import ListUsersUseCase from '../application/usecases/listusers.usecase'
import UpdateUserUseCase from '../application/usecases/update-user.usecase'
import UpdatePasswordUseCase from '../application/usecases/update-password.usecase'
import DeleteUserUseCase from '../application/usecases/delete-user.usecase copy'

@Module({
  // Registrando os usecases criados no módule
  controllers: [UsersController],
  providers: [
    UsersService,
    // Registrando usecases com dependencias
    {
      provide: 'UserRepository',
      useClass: UserInMemoryRepository,
    },
    {
      provide: 'HashProvider',
      useClass: BcryptjsHashProvider,
    },
    {
      provide: SignupUseCase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,
        HashProvider: HashProvider,
      ) => {
        return new SignupUseCase.UseCase(userRepository, HashProvider)
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: SigninUseCase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,
        HashProvider: HashProvider,
      ) => {
        return new SigninUseCase.UseCase(userRepository, HashProvider)
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: GetUserUseCase.UseCase,
      useFactory: (userRepository: UserRepository.Repository) => {
        return new GetUserUseCase.UseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
    {
      provide: ListUsersUseCase.UseCase,
      useFactory: (userRepository: UserRepository.Repository) => {
        return new ListUsersUseCase.UseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
    {
      provide: UpdateUserUseCase.UseCase,
      useFactory: (userRepository: UserRepository.Repository) => {
        return new UpdateUserUseCase.UseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
    {
      provide: UpdatePasswordUseCase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,
        HashProvider: HashProvider,
      ) => {
        return new UpdatePasswordUseCase.UseCase(userRepository, HashProvider)
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: DeleteUserUseCase.UseCase,
      useFactory: (userRepository: UserRepository.Repository) => {
        return new DeleteUserUseCase.UseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
  ],
})
export class UsersModule {}
