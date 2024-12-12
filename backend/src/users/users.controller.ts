import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/guards/AdminGuard.guard';
import { JwtAuthGuard } from 'src/guards/JWTGuard.guard';
import { ProtectedRoute } from 'src/guards/ProtectedRoute.guard';
import { UsersService } from './users.service';
import { User } from 'src/schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @Get('')
  async getAllUsers(): Promise<User[] | string> {
    try {
      const users = await this.usersService.getAllUsers();
      if (!users || users.length === 0) throw new NotFoundException();
      return users;
    } catch (err) {
      return 'You are not logged in or you are not an admin';
    }
  }
}
