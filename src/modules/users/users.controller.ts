import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	FileTypeValidator,
	Get,
	MaxFileSizeValidator,
	NotFoundException,
	Param,
	ParseFilePipe,
	Patch,
	Post,
	Query,
	UnsupportedMediaTypeException,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiParam,
	ApiResponse,
	ApiTags,
	ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger';
import { mkdirSync, writeFileSync } from 'fs';
import { ESortField, ESortOrder } from 'src/shared/enum/sort.enum';
import { appConfig } from '../../app.config';
import { SuccessResponse } from '../../shared/response/success-response';
import { GenFileName } from '../../utils/gen-filename';
import { AvatarUploadDto } from './dto/avatar-upload-dto';
import { CreateUserDto } from './dto/create-user-dto';
import { GetUserDto } from './dto/get-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { User, UserRole } from './schemas/user.schema';
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
		type: NotFoundException,
		status: 400,
		description: 'User not found!',
	})
	getUserById(@Param('id') id) {
		return this.userService.findOne({ _id: id });
	}

	@Get()
	@ApiResponse({
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					total: 0,
					filter: {
						limit: 10,
						offset: 0,
						role: UserRole.ADMIN,
						searchField: 'string',
						searchValue: 'string',
						sortField: ESortField.CREATED_AT,
						sortOrder: ESortOrder.ASC,
					} as GetUserDto,
					data: [
						{
							_id: '_id',
							displayName: 'string',
							email: 'string',
							role: UserRole.MEMBER,
							createdAt: new Date(),
							updatedAt: new Date(),
							avatar: '',
						},
					] as User[],
				},
			} as SuccessResponse<User[], GetUserDto>,
		},
		status: 200,
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	getAllUsers(@Query() filter: GetUserDto) {
		return this.userService.findAll(filter);
	}

	@Post()
	@ApiBody({
		type: CreateUserDto,
		examples: {
			ADMIN: {
				summary: 'Admin',
				value: {
					displayName: 'Admin user',
					email: 'admin@test.com',
					password: '123123123123',
					role: UserRole.ADMIN,
					avatar: '',
				} as CreateUserDto,
			},
			USER: {
				summary: 'User',
				value: {
					displayName: 'User',
					email: 'user@test.com',
					password: '123123123123',
					role: UserRole.MEMBER,
					avatar: '',
				} as CreateUserDto,
			},
		},
	})
	@ApiCreatedResponse({
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					displayName: 'User',
					email: 'user@test.com',
					role: UserRole.MEMBER,
					avatar: '',
				},
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	createUser(@Body() input: CreateUserDto) {
		return this.userService.createOne(input);
	}

	@Patch()
	@ApiOkResponse({
		// type: User,
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					displayName: 'User',
					email: 'user@test.com',
					role: UserRole.MEMBER,
					avatar: '',
				},
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	updateUser(@Body() updateUserDto: UpdateUserDto) {
		return this.userService.updateOne(updateUserDto);
	}

	@Delete(':id')
	@ApiParam({ name: 'id', type: String, description: 'User ID' })
	@ApiResponse({
		schema: {
			example: {
				code: 200,
				message: 'Success',
			} as SuccessResponse<null>,
		},
		status: 200,
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
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
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					displayName: 'User',
					email: 'user@test.com',
					role: UserRole.MEMBER,
					avatar: '',
				},
			},
		},
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'User not found!',
	})
	@ApiUnsupportedMediaTypeResponse({
		type: UnsupportedMediaTypeException,
		status: 415,
		description: 'File invalid!',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: 'File size invalid!',
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
		const fileName = GenFileName.gen(file.mimetype);
		mkdirSync(dir, { recursive: true });
		writeFileSync(`${dir}/${fileName}`, file.buffer);
		const url: string = appConfig.fileHost + `/${id}/${fileName}`;

		return this.userService.updateAvatar(id, url);
	}
}
