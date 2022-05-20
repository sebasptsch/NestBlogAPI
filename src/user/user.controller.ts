import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { SessionGuard } from 'src/auth/guard';
import { GetUser } from '../auth/decorator';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // @UseGuards(SessionGuard)
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Get(':id')
  getUser(
    @Param('id', ParseIntPipe) userId: number,
  ) {
    return this.userService.getUser(userId);
  }

  @UseGuards(SessionGuard)
  @Patch()
  editUser(
    @GetUser('id') userId: number,
    @Body() dto: EditUserDto,
  ) {
    return this.userService.editUser(userId, dto);
  }
}
