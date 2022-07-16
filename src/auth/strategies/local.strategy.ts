import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from 'src/users/entities/user.entity';
import { SignIn } from '../dto/sign-in.dto';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(validatedData: SignIn): Promise<User> {
    const user = await this.authService.validateUser(validatedData);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
