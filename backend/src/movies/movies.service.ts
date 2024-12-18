import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from 'src/schemas/movies.schema';
import { CreateMovieDTO } from './dtos/createMovieDTO.dto';
import { UpdateMovieDTO } from './dtos/updateMovieDTO.dto';

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
  async updateMovie(id: string, body: UpdateMovieDTO): Promise<Movie> {
    const movie = await this.movieModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    await movie.save({ validateBeforeSave: false });
    return movie;
  }
  async getMovieById(id: string): Promise<Movie> {
    const movie = await this.movieModel.findById(id).select('-__v');
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    return movie;
  }
}
