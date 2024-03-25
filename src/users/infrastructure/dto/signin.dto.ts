import { SigninUseCase } from '@/users/application/usecases/signin.usecase'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SigninDto implements SigninUseCase.Input {
  @ApiProperty({
    description: 'Email do usuário',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'Senha do usuário',
  })
  @IsString()
  @IsNotEmpty()
  password: string
}
