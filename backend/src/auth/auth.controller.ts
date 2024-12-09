import { Body, Controller, Post, Request, Res } from '@nestjs/common';
import { SigninDTO } from 'src/dtos/signinDTO.dto';
import { SignupDTO } from 'src/dtos/signupDTO.dto';
import { User } from 'src/schemas/user.schema';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signup')
  async signup(@Body() body: SignupDTO): Promise<User> {
    return await this.authService.createUser(body);
  }
  @Post('/signin')
  async signin(@Body() body: SigninDTO, @Res() response: Response) {
    await this.authService.login(body, response);
    return response.status(200).send({ message: 'Login successful' });
  }
}
