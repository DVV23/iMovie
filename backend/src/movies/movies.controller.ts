import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { JwtAuthGuard } from 'src/guards/JWTGuard.guard';
import { Movie, MovieDocument } from 'src/schemas/movies.schema';
import { GetCurrentUser } from 'src/decorators/currentUser.decorator';
import { User, UserDocument } from 'src/schemas/user.schema';
import { CreateMovieDTO } from './dtos/createMovieDTO.dto';
import { UpdateMovieDTO } from './dtos/updateMovieDTO.dto';
import { ReviewsService } from 'src/reviews/reviews.service';
import { CreateReviewDTO } from 'src/reviews/dtos/createReviewDTO.dto';
import { AdminGuard } from 'src/guards/AdminGuard.guard';

@Controller('movies')
@UseGuards(JwtAuthGuard)
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly reviewsService: ReviewsService,
  ) {}
  @Get('/')
  async getMovies(): Promise<Movie[] | Movie> {
    return await this.moviesService.getMovies();
  }
  @Post('/createMovie')
  async createMovie(
    @GetCurrentUser() user: User,
    @Body() body: CreateMovieDTO,
  ): Promise<void | string> {
    return await this.moviesService.createMovie(body);
  }
  @UseGuards(AdminGuard)
  @Delete('/deleteMovie')
  async deleteMovie(): Promise<void> {}

  @Get('/:id')
  async getMovieById(@Param('id') id: string): Promise<Movie | Movie[]> {
    return await this.moviesService.getMovies(id);
  }
  @UseGuards(AdminGuard)
  @Patch('/:id/updateMovie')
  async updateMovie(
    @Param('id') id: string,
    @Body() body: UpdateMovieDTO,
  ): Promise<Movie> {
    return await this.moviesService.updateMovie(id, body);
  }

  @Post('/:id/createReview')
  async createReviewForMovie(
    @Param('id') id: string,
    @Body() body: CreateReviewDTO,
    @GetCurrentUser() user: UserDocument,
  ): Promise<any> {
    const movie = (await this.moviesService.getMovies(id)) as MovieDocument;
    return await this.reviewsService.createReviewForMovie(movie, user, body);
  }
}
