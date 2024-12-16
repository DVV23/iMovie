import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';

export class UpdatePasswordDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  newPassword: string;
  @IsString()
  @IsNotEmpty()
  confirmNewPassword: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  currentPassword: string;
}
