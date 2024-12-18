import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from 'src/schemas/movies.schema';
import { Review } from 'src/schemas/reviews.schema';
import { User } from 'src/schemas/user.schema';
import { CreateReviewDTO } from './dtos/createReviewDTO.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
  ) {}
  async createReviewForMovie(
    movie: MovieDocument,
    user: User,
    { review }: CreateReviewDTO,
  ): Promise<any> {
    try {
      const newReview = await this.reviewModel.create({
        review,
        forMovie: movie._id,
        createdByUser: user._id,
      });
      movie.reviews.push(newReview._id);
      movie.save();
      return newReview;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}
