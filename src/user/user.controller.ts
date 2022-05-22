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
import { SessionGuard } from 'src/auth/guard';
import { GetUser } from '../auth/decorator';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import {
  ApiTags,
  ApiCookieAuth,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  /** Get my user info */
  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @Get('me')
  getMe(@GetUser('id') id: number) {
    return this.userService.getPrivateUser(id);
  }

  /** Get a user by their Id */
  @Get(':id')
  getUser(
    @Param('id', ParseIntPipe) userId: number,
  ) {
    return this.userService.getUser(userId);
  }

  /** Edit a user by their Id */
  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @Patch()
  editUser(
    @GetUser('id') userId: number,
    @Body() dto: EditUserDto,
  ) {
    return this.userService.editUser(userId, dto);
  }

  /** Delete a user by their Id */
  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @Delete('me')
  deleteUser(@GetUser('id') userId: number) {
    return this.userService.deleteUser(userId);
  }
}
