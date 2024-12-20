import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from 'src/schemas/movies.schema';
import { Review } from 'src/schemas/reviews.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import { CreateReviewDTO } from './dtos/createReviewDTO.dto';
import { Response } from 'express';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
  ) {}
  async createReviewForMovie(
    movie: MovieDocument,
    user: UserDocument,
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
      user.reviews.push(newReview._id);
      user.save({ validateBeforeSave: false });
      return newReview;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
  async getReviewById(id: string): Promise<Review> {
    const review = await this.reviewModel.findById(id).populate([
      { path: 'forMovie', select: 'title genre' },
      { path: 'createdByUser', select: 'name' },
    ]);
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  async deleteReview(id: string, response: Response): Promise<any> {
    try {
      await this.reviewModel.deleteOne({ _id: id });
      return response
        .status(200)
        .send({ message: 'Review was succesfully deleted' });
    } catch (err) {
      throw new InternalServerErrorException(
        'There was an error while deleting review',
      );
    }
  }
}
