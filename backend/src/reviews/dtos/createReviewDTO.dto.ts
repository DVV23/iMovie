import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateReviewDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  review: string;
}
