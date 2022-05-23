import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { SessionGuard } from '../auth/guard/index.js';
import { GetUser } from '../auth/decorator/index.js';
import { EditUserDto } from './dto/index.js';
import { UserService } from './user.service.js';
import {
  ApiCookieAuth,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @Get('me')
  getMe(@GetUser('id') id: number) {
    return this.userService.getPrivateUser(id);
  }

  @Get(':id')
  getUser(
    @Param('id', ParseIntPipe) userId: number,
  ) {
    return this.userService.getUser(userId);
  }

  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @Patch()
  editUser(
    @GetUser('id') userId: number,
    @Body() dto: EditUserDto,
  ) {
    return this.userService.editUser(userId, dto);
  }

  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @Delete('me')
  deleteUser(@GetUser('id') userId: number) {
    return this.userService.deleteUser(userId);
  }
}
