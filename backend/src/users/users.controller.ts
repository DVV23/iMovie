import { Controller, Get, UseGuards } from '@nestjs/common';
import { ProtectedRoute } from 'src/guards/ProtectedRoute.guard';

@Controller('users')
export class UsersController {
  @UseGuards(ProtectedRoute)
  @Get('')
  async getUsers() {
    console.log('just a check');
  }
}
