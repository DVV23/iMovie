import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateMovieDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  @MaxLength(255, {
    message: 'Description must be at most 255 characters long',
  })
  description: string;
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  cast?: string[];
}
