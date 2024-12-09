import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import { SigninDTO } from 'src/dtos/signinDTO.dto';
import { JwtPayload } from 'src/schemas/jwtPayload.interface';
import { checkPassword } from 'src/utils/utils';
import { SignupDTO } from './../dtos/signupDTO.dto';
import { User } from './../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async createUser({ email, password, name }: SignupDTO): Promise<User> {
    try {
      const user = this.userModel.create({ email, password, name });
      return user;
    } catch (err) {
      return err;
    }
  }
  async login({ email, password }: SigninDTO, response: Response) {
    const newUser: User = await this.userModel
      .findOne({ email })
      .select('+password');
    if (!newUser) {
      throw new NotFoundException('User not found');
    }
    const passCheck = await checkPassword(password, newUser.password);
    if (!passCheck) throw new UnauthorizedException('Password is incorrect');
    const payload: JwtPayload = { email };
    const accessToken: string = await this.jwtService.sign(payload);
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );
    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      expires,
    });
  }
}
