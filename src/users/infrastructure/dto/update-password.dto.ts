import UpdatePasswordUseCase from '@/users/application/usecases/update-password.usecase'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

// Omite o campo id pois ele vem como parametro e não no body
export class UpdatePasswordDto
  implements Omit<UpdatePasswordUseCase.Input, 'id'>
{
  @ApiProperty({
    description: 'Nova senha do usuário',
  })
  @IsString()
  @IsNotEmpty()
  password: string

  @ApiProperty({
    description: 'Senha atual do usuário',
  })
  @IsString()
  @IsNotEmpty()
  oldPassword: string
}
