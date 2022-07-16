import {
  Controller,
  Post,
  UseGuards,
  Body,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { ResetPassword } from './dto/reset-password.dto';
import { SignIn } from './dto/sign-in.dto';
import { SignUp } from './dto/sign-up.dto';
import { JwtAuthGuard } from './guards/iwt-auth.guard';
import { AuthService } from './services/auth.service';

interface AccessToken {
  access_token: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() input: SignIn): Promise<AccessToken> {
    const accessToken = await this.authService.signin(input);

    return accessToken;
  }

  @Post('register')
  async signup(@Body() input: SignUp): Promise<User> {
    const user = await this.authService.signup(input);

    return user;
  }

  @Patch('reset-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() input: ResetPassword) {
    const user = await this.authService.validateUser({
      email: input.email,
      password: input.oldPassword,
    });

    if (!user) {
      throw new NotFoundException('email not found');
    }
    const updateData = { password: input.newPassword };
    const updateUser = await this.authService.resetPassword(
      user.id,
      updateData,
    );

    return updateUser;
  }
}
