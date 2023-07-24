import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import {
  Serialize,
  SerializeInterceptor,
} from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';

@Controller('auth')
// controller wide serailize decorator
@Serialize(UserDto)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('sign-up')
  createUser(@Body() body: CreateUserDto) {
    return this.userService.create(body.email, body.password);
  }

  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    return this.userService.update(id, body);
  }

  // @UseInterceptors(new SerializeInterceptor(UserDto))
  @Get('user/:id')
  findUser(@Param('id', ParseIntPipe) id: number) {
    console.log('Handler is running');
    return this.userService.findOne(id);
  }

  @Get('user')
  findAllUsers(@Param('email') email: string) {
    return this.userService.find(email);
  }

  @Delete('user/:id')
  removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
