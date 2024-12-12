import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignupDTO } from 'src/dtos/signupDTO.dto';
import { User, UserDocument } from 'src/schemas/user.schema';

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
}
