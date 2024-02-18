import UpdatePasswordUseCase from '@/users/application/usecases/update-password.usecase'

// Omite o campo id pois ele vem como parametro e não no body
export class UpdatePasswordDto
  implements Omit<UpdatePasswordUseCase.Input, 'id'>
{
  password: string
  oldPassword: string
}
