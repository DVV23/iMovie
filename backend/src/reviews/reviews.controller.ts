import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review } from 'src/schemas/reviews.schema';
import { JwtAuthGuard } from 'src/guards/JWTGuard.guard';
import { Response } from 'express';
import { AdminGuard } from 'src/guards/AdminGuard.guard';

@UseGuards(JwtAuthGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}
  @Get('/:reviewId')
  async getReviewById(@Param('reviewId') id: string): Promise<Review> {
    if (!id) throw new BadRequestException('ID is not provided');
    return await this.reviewsService.getReviewById(id);
  }
  @UseGuards(AdminGuard)
  @Delete('/:reviewId')
  async deleteReview(
    @Param('reviewId') id: string,
    @Res() response: Response,
  ): Promise<any> {
    if (!id) throw new BadRequestException('ID is not provided');
    return await this.reviewsService.deleteReview(id, response);
  }
}
