import { Injectable, BadRequestException } from '@nestjs/common';
import { UserService } from '../../users/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { SignUp } from '../dto/sign-up.dto';
import { SignIn } from '../dto/sign-in.dto';
import { User } from 'src/users/entities/user.entity';
import { hashPassword } from '../../shared/hash-password';
import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signin(signInData: SignIn) {
    const user = await this.userService.findOne(signInData.email);

    if (!user) {
      throw new BadRequestException('email not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(signInData.password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('wrong password');
    }

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(signupData: SignUp) {
    const user = await this.userService.findOne(signupData.email);
    if (user) {
      throw new BadRequestException('email in use');
    }
    const password = await hashPassword(signupData.password);

    const userData = { ...signupData, password };
    const createdUser = await this.userService.create(userData);

    delete createdUser.password;
    return createdUser;
  }

  async validateUser(validatedData: SignIn): Promise<User> {
    const user = await this.userService.findOne(validatedData.email);

    if (!user) {
      return null;
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(validatedData.password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      return null;
    }
    delete user.password;
    return user;
  }

  async resetPassword(id: number, updateData: Partial<User>): Promise<User> {
    const password = await hashPassword(updateData.password);
    const user = await this.userService.update(id, { password });

    return user;
  }
}
