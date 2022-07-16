import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { IsUserExist } from './validators/is-user-exist.validator';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, IsUserExist],
  exports: [UserService],
  controllers: [UserController],
})
export class UsersModule {}
