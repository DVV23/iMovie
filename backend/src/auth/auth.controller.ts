import { Body, Controller, Post, Req, Res, Session } from '@nestjs/common';
import { Response } from 'express';
import { SigninDTO } from 'src/dtos/signinDTO.dto';
import { SignupDTO } from 'src/dtos/signupDTO.dto';
import { User, UserDocument } from 'src/schemas/user.schema';
import { AuthService } from './auth.service';
import { GetCurrentUser } from 'src/decorators/currentUser.decorator';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  @Post('/signup')
  async signup(@Body() body: SignupDTO): Promise<User> {
    return await this.authService.signup(body);
  }
  @Post('/signin')
  async signin(
    @Body() body: SigninDTO,
    @Res() response: Response,
    @Session() session: any,
  ) {
    const { email } = await this.usersService.findUser(body.email);
    session.email = email;
    await this.authService.login(body, response, session);
    return response.status(200).send({ message: 'Login successful' });
  }
  @Post('/logout')
  async logout(@Res() response: Response, @Session() session: any) {
    session.email = null;
    return this.authService.logout(response);
  }
}
