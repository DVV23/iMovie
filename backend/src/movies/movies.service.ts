import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from 'src/schemas/movies.schema';
import { CreateMovieDTO } from './dtos/createMovieDTO.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<Movie>,
  ) {}

  async getMovies(): Promise<Movie[]> {
    const movies = await this.movieModel.find();
    if (!movies) throw new NotFoundException('No movies yet');
    return movies;
  }
  async createMovie(body: CreateMovieDTO): Promise<void | string> {
    try {
      const result = await this.movieModel.create(body);
      result.save({ validateBeforeSave: true });
      return 'Movie succesfully created';
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
