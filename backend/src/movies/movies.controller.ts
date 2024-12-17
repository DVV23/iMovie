import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { JwtAuthGuard } from 'src/guards/JWTGuard.guard';
import { Movie } from 'src/schemas/movies.schema';
import { GetCurrentUser } from 'src/decorators/currentUser.decorator';
import { User } from 'src/schemas/user.schema';
import { CreateMovieDTO } from './dtos/createMovieDTO.dto';

@Controller('movies')
@UseGuards(JwtAuthGuard)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}
  @Get('/')
  async getMovies(): Promise<Movie[]> {
    return await this.moviesService.getMovies();
  }
  @UseGuards(JwtAuthGuard)
  @Post('/createMovie')
  async createMovie(
    @GetCurrentUser() user: User,
    @Body() body: CreateMovieDTO,
  ): Promise<void | string> {
    return await this.moviesService.createMovie(body);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('/deleteMovie')
  async deleteMovie(): Promise<void> {}
  @Get('/:id')
  async getMovieById() {}
}
