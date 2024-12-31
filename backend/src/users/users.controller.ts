import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUser } from 'src/decorators/currentUser.decorator';
import { UpdatePasswordDTO } from 'src/dtos/updatePasswordDTO';
import { AdminGuard } from 'src/guards/AdminGuard.guard';
import { JwtAuthGuard } from 'src/guards/JWTGuard.guard';
import { User } from 'src/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(AdminGuard)
  @Get('/')
  async getAllUsers(): Promise<User[] | string> {
    try {
      const users = await this.usersService.getAllUsers();
      if (!users || users.length === 0) throw new NotFoundException();
      return users;
    } catch (err) {
      return 'You are not logged in or you are not an admin';
    }
  }
  @Post('/updatePassword')
  async updatePassword(
    @Body() body: UpdatePasswordDTO,
    @GetCurrentUser() user: User,
  ): Promise<void | string> {
    if (!user) throw new UnauthorizedException('User not authenticated');
    return await this.usersService.updatePassword(body, user);
  }
  @UseGuards(AdminGuard)
  @Delete('/deleteUser/:id')
  async deleteUser(@Param('id') id: string): Promise<void | string> {
    if (!id) throw new BadRequestException('Please provide ID of user');
    return await this.usersService.deleteUser(id);
  }
}
