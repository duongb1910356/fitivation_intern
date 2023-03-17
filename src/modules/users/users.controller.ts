import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { mkdirSync, writeFileSync } from 'fs';
import { SuccessResponse } from '../../shared/response/success-response';
import { appConfig } from '../../app.config';
import { AvatarUploadDto } from './dto/avatar-upload-dto';
import { CreateUserDto } from './dto/create-user-dto';
import { GetUserDto } from './dto/get-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':id')
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiOkResponse({ type: User, status: 200 })
  @ApiNotFoundResponse({
    type: 'string',
    status: 400,
    description: 'User not found!',
  })
  getUserById(@Param('id') id) {
    return this.userService.findOne({ _id: id });
  }

  @Get()
  @ApiResponse({ type: [User], status: 200 })
  @ApiBadRequestResponse({
    type: 'string',
    status: 400,
    description: '[Input] invalid!',
  })
  getAllUsers(@Query() filter: GetUserDto) {
    return this.userService.findAll(filter);
  }

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ type: User, status: 201 })
  @ApiBadRequestResponse({
    type: 'string',
    status: 400,
    description: '[Input] invalid!',
  })
  createUser(@Body() input: CreateUserDto) {
    return this.userService.createOne(input);
  }

  @Patch()
  @ApiResponse({ type: User, status: 201 })
  @ApiBadRequestResponse({
    type: 'string',
    status: 400,
    description: '[Input] invalid!',
  })
  updateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateOne(updateUserDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiResponse({ type: SuccessResponse<User>, status: 200 })
  @ApiBadRequestResponse({
    type: 'string',
    status: 400,
    description: '[Input] invalid!',
  })
  @ApiNotFoundResponse({
    type: 'string',
    status: 404,
    description: 'User not found!',
  })
  deleteUser(@Param() id: string) {
    return this.userService.deleteOne(id);
  }

  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: AvatarUploadDto })
  @ApiOkResponse({
    type: User,
    status: 200,
  })
  uploadFile(
    @Param('id') id,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 1000 }), // 1MB
          new FileTypeValidator({ fileType: /(?:jpeg|png)/i }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const dir = `${appConfig.fileRoot}/${id}`;
    mkdirSync(dir, { recursive: true });
    writeFileSync(`${dir}/${file.originalname}`, file.buffer);
    const url: string = appConfig.fileHost + `/${id}/${file.originalname}`;

    return this.userService.updateAvatar(id, url);
  }
}
