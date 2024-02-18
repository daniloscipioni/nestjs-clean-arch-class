import UpdateUserUseCase from '@/users/application/usecases/update-user.usecase'

// Omite o campo id pois ele vem como parametro e não no body
export class UpdateUserDto implements Omit<UpdateUserUseCase.Input, 'id'> {
  name: string
}
