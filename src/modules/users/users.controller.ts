import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':id')
  @ApiResponse({ type: User, status: 200 })
  getUserById(@Param('id') id) {
    return this.userService.findOne({ _id: id });
  }

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ type: User, status: 201 })
  createUser(@Body() input: CreateUserDto) {
    return this.userService.createOne(input);
  }
}
