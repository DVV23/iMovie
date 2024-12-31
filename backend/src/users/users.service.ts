import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignupDTO } from 'src/dtos/signupDTO.dto';
import { UpdatePasswordDTO } from 'src/dtos/updatePasswordDTO';
import { AdminGuard } from 'src/guards/AdminGuard.guard';
import { User, UserDocument } from 'src/schemas/user.schema';
import { checkPassword } from 'src/utils/utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async signup({
    email,
    password,
    passwordConfirm,
    name,
  }: SignupDTO): Promise<User> | null {
    try {
      const user = this.userModel.create({
        email,
        password,
        passwordConfirm,
        name,
      });
      return user;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  // <--- ! to implement in the controller ! --->
  async findUser(email: string): Promise<User> {
    return await this.userModel.findOne({ email }).select('+password');
  }
  async getAllUsers(): Promise<User[]> {
    return await this.userModel.find().where({ active: true });
  }
  async verifyUser(email: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).select('+password');
    const validPassword = checkPassword(password, user.password);
    if (!user || !validPassword) throw new NotFoundException();
    return user;
  }

  async updatePassword(
    { newPassword, confirmNewPassword, currentPassword }: UpdatePasswordDTO,
    { email }: User,
  ): Promise<void | string> {
    const user = await this.userModel.findOne({ email }).select('+password');
    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException(
        'Confirm new password or password are not equal',
      );
    }
    const validPassword = checkPassword(currentPassword, user.password);
    if (!validPassword) {
      throw new UnauthorizedException('Wrong ');
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: true });
    if (!user.isModified) {
      throw new InternalServerErrorException('Password update failed');
    }
  }
  async deleteUser(id: string): Promise<void | string> {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new BadRequestException('User for provided ID was not found.');
      }
      user.active = false;
      await user.save({ validateBeforeSave: false });
      return 'User was succesfully deleted';
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
