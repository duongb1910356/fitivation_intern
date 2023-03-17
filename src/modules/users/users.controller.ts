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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { mkdirSync, writeFileSync } from 'fs';
import { appConfig } from 'src/app.config';
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
  @ApiResponse({ type: User, status: 200 })
  getUserById(@Param('id') id) {
    return this.userService.findOne({ _id: id });
  }

  @Get()
  @ApiResponse({ type: User, status: 200 })
  getAllUsers(@Param() filter: GetUserDto) {
    return this.userService.findAll(filter);
  }

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ type: User, status: 201 })
  createUser(@Body() input: CreateUserDto) {
    return this.userService.createOne(input);
  }

  @Patch()
  updateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateOne(updateUserDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  deleteUser(@Param() id: string) {
    return this.userService.deleteOne(id);
  }

  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: AvatarUploadDto })
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
