import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsDateString,
  IsOptional,
  IsNumber,
  MinLength,
  MaxLength,
  IsPositive,
  Max,
  Min,
} from 'class-validator';

export class CreateMovieDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  @MaxLength(255, {
    message: 'Description must be at most 255 characters long',
  })
  description: string;

  @IsArray()
  @IsString({ each: true })
  genre: string[];

  @IsNumber()
  @IsPositive()
  duration: number;

  @IsString()
  @IsOptional()
  director?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  cast?: string[];

  @IsNotEmpty()
  @IsNumber()
  @Max(5)
  @Min(1)
  rating: Number;

  @IsString()
  @IsNotEmpty()
  createdAt: string;

  @IsArray()
  @IsString({ each: true })
  language: string[];

  @IsDateString()
  releaseDate: string;
}
