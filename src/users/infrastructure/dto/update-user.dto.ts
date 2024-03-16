import UpdateUserUseCase from '@/users/application/usecases/update-user.usecase'
import { IsNotEmpty, IsString } from 'class-validator'

// Omite o campo id pois ele vem como parametro e não no body
export class UpdateUserDto implements Omit<UpdateUserUseCase.Input, 'id'> {
  @IsString()
  @IsNotEmpty()
  name: string
}
