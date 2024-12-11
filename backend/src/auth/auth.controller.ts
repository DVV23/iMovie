import { Body, Controller, Post, Res, Session } from '@nestjs/common';
import { Response } from 'express';
import { SigninDTO } from 'src/dtos/signinDTO.dto';
import { SignupDTO } from 'src/dtos/signupDTO.dto';
import { UserDocument } from 'src/schemas/user.schema';
import { AuthService } from './auth.service';
import { GetCurrentUser } from 'src/decorators/currentUser.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signup')
  async signup(@Body() body: SignupDTO): Promise<UserDocument> {
    return await this.authService.createUser(body);
  }
  @Post('/signin')
  async signin(
    @Body() body: SigninDTO,
    @Res() response: Response,
    @Session() session: any,
  ) {
    const { email } = await this.authService.findUser(body.email);
    session.email = email;
    await this.authService.login(body, response, session);
    return response.status(200).send({ message: 'Login successful' });
  }
  @Post('/logout')
  async logout(@Res() response: Response) {
    return this.authService.logout(response);
  }
}
