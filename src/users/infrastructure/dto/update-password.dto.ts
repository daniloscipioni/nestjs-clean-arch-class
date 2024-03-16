import UpdatePasswordUseCase from '@/users/application/usecases/update-password.usecase'
import { IsNotEmpty, IsString } from 'class-validator'

// Omite o campo id pois ele vem como parametro e não no body
export class UpdatePasswordDto
  implements Omit<UpdatePasswordUseCase.Input, 'id'>
{
  @IsString()
  @IsNotEmpty()
  password: string

  @IsString()
  @IsNotEmpty()
  oldPassword: string
}
