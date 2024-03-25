import UpdateUserUseCase from '@/users/application/usecases/update-user.usecase'
import { ApiProperty } from '@nestjs/swagger'

import { IsNotEmpty, IsString } from 'class-validator'

// Omite o campo id pois ele vem como parametro e não no body
export class UpdateUserDto implements Omit<UpdateUserUseCase.Input, 'id'> {
  @ApiProperty({
    description: 'Nome do usuário',
  })
  @IsString()
  @IsNotEmpty()
  name: string
}
