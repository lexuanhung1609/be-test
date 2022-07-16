import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/iwt-auth.guard';
import { hashPassword } from 'src/shared/hash-password';
import { UpdateProfile } from './dto/update-profile.dto';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateProfile(@Request() req, @Body() input: Partial<UpdateProfile>) {
    let updateUser: User;
    if (!input.password) {
      updateUser = await this.userService.update(req.user.userId, input);
    } else {
      const password = await hashPassword(input.password);
      updateUser = await this.userService.update(req.user.userId, {
        ...input,
        password,
      });
    }

    return updateUser;
  }
}
