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
import { User, UserDocument } from 'src/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { checkPassword } from 'src/utils/utils';
import { SignupDTO } from './../dtos/signupDTO.dto';
declare global {
  namespace Express {
    interface Response {
      cookies: { [key: string]: string };
    }
  }
}
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async signup(body: SignupDTO): Promise<User> {
    try {
      return await this.usersService.signup(body);
    } catch (err) {
      return err;
    }
  }
  async login(
    { email, password }: SigninDTO,
    response: Response,
    session: any,
  ): Promise<void> {
    console.log(email, password);
    const newUser = await this.usersService.findUser(email);
    console.log(newUser);
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
  async logout(response: Response): Promise<any> {
    if (!response.req.cookies.Authentication) {
      return response
        .status(400)
        .send({ message: 'You are already logged out' });
    }
    response.clearCookie('Authentication').clearCookie('jwt');
    return response.status(201).send({ message: 'You have logged out.' });
  }
}
