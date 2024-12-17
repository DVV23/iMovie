import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from 'src/schemas/movies.schema';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { Review, ReviewSchema } from 'src/schemas/reviews.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Movie.name, schema: MovieSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
  ],
  providers: [MoviesService],
  controllers: [MoviesController],
})
export class MoviesModule {}
