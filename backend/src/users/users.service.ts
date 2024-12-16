import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignupDTO } from 'src/dtos/signupDTO.dto';
import { UpdatePasswordDTO } from 'src/dtos/updatePasswordDTO';
import { User, UserDocument } from 'src/schemas/user.schema';
import { checkPassword } from 'src/utils/utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async signup({ email, password, name }: SignupDTO): Promise<User> | null {
    try {
      const user = this.userModel.create({ email, password, name });
      return user;
    } catch (err) {
      return err;
    }
  }
  async findUser(email: string): Promise<User> {
    return await this.userModel.findOne({ email }).select('+password');
  }
  async getAllUsers(): Promise<User[]> {
    return await this.userModel.find();
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
}
