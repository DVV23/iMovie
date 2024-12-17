import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class SignupDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
  @IsNotEmpty()
  @IsStrongPassword()
  passwordConfirm: string;
  @IsNotEmpty()
  @IsString()
  name: string;
}
