import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from 'src/schemas/jwtPayload.interface';
import { User } from 'src/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) =>
          request?.cookies?.Authentication || request?.Authentication,
      ]),
    });
  }

  async validate({ email }: JwtPayload): Promise<User> {
    const user: User = await this.usersService.findUser(email);
    console.log(user);
    if (!user || !email) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
