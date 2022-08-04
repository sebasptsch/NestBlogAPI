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
import { SessionGuard } from '../auth/guard/index.js';
import { GetUser } from '../auth/decorator/index.js';
import { EditUserDto } from './dto/index.js';
import { UserService } from './user.service.js';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from './dto/User.dto.js';
import { MinimalUserDto } from './dto/MinimalUser.dto.js';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @Get('me')
  @ApiOperation({ operationId: 'getMe' })
  @ApiOkResponse({ type: UserDto })
  getMe(@GetUser('id') id: number) {
    return this.userService.getPrivateUser(id);
  }

  @Get(':id')
  @ApiOkResponse({ type: MinimalUserDto })
  @ApiOperation({ operationId: 'getUser' })
  getUser(
    @Param('id', ParseIntPipe)
    userId: number,
  ) {
    return this.userService.getUser(userId);
  }

  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @ApiOkResponse({ type: UserDto })
  @ApiOperation({ operationId: 'editUser' })
  @Patch()
  editUser(
    @GetUser('id') userId: number,
    @Body() dto: EditUserDto,
  ) {
    return this.userService.editUser(userId, dto);
  }

  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @ApiOperation({ operationId: 'deleteUser' })
  @ApiOkResponse({ type: UserDto })
  @Delete('me')
  deleteUser(@GetUser('id') userId: number) {
    return this.userService.deleteUser(userId);
  }
}
