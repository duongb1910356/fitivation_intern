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
	Req,
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
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
	ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger';
import { mkdirSync, writeFileSync } from 'fs';
import { appConfig } from '../../app.config';
import { SuccessResponse } from '../../shared/response/success-response';
import { GenFileName } from '../../utils/gen-filename';
import { AvatarUploadDto } from './dto/avatar-upload-dto';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { Gender, User, UserRole, UserStatus } from './schemas/user.schema';
import { UsersService } from './users.service';
import { UserAddressDto } from './dto/user-address.dto';
import { UserAddress } from './schemas/user-address.schema';
import {
	ErrorResponse,
	ListOptions,
	ListResponse,
} from 'src/shared/response/common-response';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
	constructor(private readonly userService: UsersService) { }

	@Get(':id')
	@ApiOperation({ summary: 'getUserByID', description: 'Get one user by ID' })
	@ApiParam({ name: 'id', type: String, description: 'User ID' })
	@ApiOkResponse({
		schema: {
			example: {
				_id: '',
				role: UserRole.MEMBER,
				username: 'member',
				email: 'member@test.com',
				password: '123123123123',
				displayName: 'Admin user',
				firstName: 'string',
				lastName: 'string',
				gender: Gender.MALE,
				birthDate: new Date(),
				tel: '0888888888',
				address: {
					province: 'Can Tho',
					district: 'Ninh Kieu',
					commune: 'Xuan Khanh',
				} as unknown as UserAddress,
				status: UserStatus.ACTIVE,
				createdAt: new Date(),
				updatedAt: new Date(),
			} as User,
		},
	})
	@ApiResponse({
		status: 400,
		schema: {
			example: {
				code: '400',
				message: 'User not found',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 401,
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: '403',
				message: `Forbidden resource`,
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 404,
		schema: {
			example: {
				code: '404',
				message: 'Not found document with that ID',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	getUserByID(@Param('id') id) {
		return this.userService.findOne({ _id: id });
	}

	@Get()
	@ApiDocsPagination('user')
	@ApiOperation({ summary: 'getManyUsers', description: 'Get many users' })
	@ApiResponse({
		schema: {
			example: {
				items: [
					{
						_id: '',
						role: UserRole.MEMBER,
						username: 'member',
						email: 'member@test.com',
						password: '123123123123',
						displayName: 'Admin user',
						firstName: 'string',
						lastName: 'string',
						gender: Gender.MALE,
						birthDate: new Date(),
						tel: '0888888888',
						address: {
							province: 'Can Tho',
							district: 'Ninh Kieu',
							commune: 'Xuan Khanh',
						} as unknown as UserAddress,
						status: UserStatus.ACTIVE,
						createdAt: new Date(),
						updatedAt: new Date(),
					} as User,
				],
				total: 1,
				options: {
					limit: 10,
					offset: 0,
					searchField: '_id',
					searchValue: 'string',
					sortField: '_id',
					sortOrder: 'asc',
				} as ListOptions<User>,
			} as ListResponse<User>,
		},
	})
	@ApiResponse({
		status: 400,
		schema: {
			example: {
				code: '400',
				message: 'Input invalid',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 401,
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: '403',
				message: `Forbidden resource`,
				details: null,
			} as ErrorResponse<null>,
		},
	})
	getManyUsers(@Query() filter: ListOptions<User>) {
		return this.userService.findAll(filter);
	}

	@Post()
	@ApiOperation({ summary: 'createUser', description: 'Create new user' })
	@ApiBody({
		type: CreateUserDto,
		examples: {
			ADMIN: {
				summary: 'Admin',
				value: {
					role: UserRole.ADMIN,
					username: 'admin',
					email: 'admin@test.com',
					password: '123123123123',
					displayName: 'Admin user',
					firstName: 'string',
					lastName: 'string',
					gender: Gender.MALE,
					birthDate: new Date(),
					tel: '0888888888',
					address: {
						province: 'Can Tho',
						district: 'Ninh Kieu',
						commune: 'Xuan Khanh',
					} as UserAddressDto,
					status: UserStatus.ACTIVE,
				} as CreateUserDto,
			},
			USER: {
				summary: 'User',
				value: {
					role: UserRole.MEMBER,
					username: 'member',
					email: 'member@test.com',
					password: '123123123123',
					displayName: 'Admin user',
					firstName: 'string',
					lastName: 'string',
					gender: Gender.MALE,
					birthDate: new Date(),
					tel: '0888888888',
					address: {
						province: 'Can Tho',
						district: 'Ninh Kieu',
						commune: 'Xuan Khanh',
					} as UserAddressDto,
					status: UserStatus.ACTIVE,
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
					_id: '',
					role: UserRole.MEMBER,
					username: 'member',
					email: 'member@test.com',
					password: '123123123123',
					displayName: 'Admin user',
					firstName: 'string',
					lastName: 'string',
					gender: Gender.MALE,
					birthDate: new Date(),
					tel: '0888888888',
					address: {
						province: 'Can Tho',
						district: 'Ninh Kieu',
						commune: 'Xuan Khanh',
					} as unknown as UserAddress,
					status: UserStatus.ACTIVE,
					createdAt: new Date(),
					updatedAt: new Date(),
				} as User,
			},
		},
	})
	@ApiResponse({
		status: 400,
		schema: {
			example: {
				code: '400',
				message: 'Input invalid',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 401,
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: '403',
				message: `Forbidden resource`,
				details: null,
			} as ErrorResponse<null>,
		},
	})
	createUser(@Body() input: CreateUserDto) {
		return this.userService.createOne(input);
	}

	@Patch('/:id')
	@ApiOperation({
		summary: 'updateUser',
		description: 'Update user information',
	})
	@ApiParam({ name: 'id', type: String, description: 'User ID' })
	@ApiBody({
		type: UpdateUserDto,
		examples: {
			example1: {
				value: {
					role: UserRole.MEMBER,
					username: 'member',
					email: 'member@test.com',
					displayName: 'Admin user',
					firstName: 'string',
					lastName: 'string',
					gender: Gender.MALE,
					birthDate: new Date(),
					tel: '0888888888',
					address: {
						province: 'Can Tho',
						district: 'Ninh Kieu',
						commune: 'Xuan Khanh',
					} as unknown as UserAddress,
					status: UserStatus.ACTIVE,
				},
			},
		},
	})
	@ApiOkResponse({
		schema: {
			example: {
				_id: '',
				role: UserRole.MEMBER,
				username: 'member',
				email: 'member@test.com',
				password: '123123123123',
				displayName: 'Admin user',
				firstName: 'string',
				lastName: 'string',
				gender: Gender.MALE,
				birthDate: new Date(),
				tel: '0888888888',
				address: {
					province: 'Can Tho',
					district: 'Ninh Kieu',
					commune: 'Xuan Khanh',
				} as unknown as UserAddress,
				status: UserStatus.ACTIVE,
				createdAt: new Date(),
				updatedAt: new Date(),
			} as User,
		},
	})
	@ApiResponse({
		status: 400,
		schema: {
			example: {
				code: '400',
				message: 'Input invalid',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 401,
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: '403',
				message: `Forbidden resource`,
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 404,
		schema: {
			example: {
				code: '404',
				message: 'Not found document with that ID',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	updateUser(@Body() updateUserDto: UpdateUserDto, @Param('id') id: string) {
		return this.userService.updateOne(updateUserDto);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'deleteUser', description: 'Delete user ' })
	@ApiParam({ name: 'id', type: String, description: 'User ID' })
	@ApiResponse({
		schema: {
			example: {
				code: 200,
				message: 'Success',
			},
		},
		status: 200,
	})
	@ApiResponse({
		status: 400,
		schema: {
			example: {
				code: '400',
				message: 'Input invalid',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 401,
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: '403',
				message: `Forbidden resource`,
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 404,
		schema: {
			example: {
				code: '404',
				message: 'Not found user with that ID',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	deleteUser(@Param() id: string) {
		return this.userService.deleteOne(id);
	}

	@Post(':id/avatar')
	@ApiOperation({
		summary: 'uploadFile',
		description: 'Upload user avatar file',
	})
	@UseInterceptors(FileInterceptor('avatar'))
	@ApiConsumes('multipart/form-data')
	@ApiParam({ name: 'id', type: String, description: 'User ID' })
	@ApiBody({ type: AvatarUploadDto })
	@ApiOkResponse({
		schema: {
			example: {
				_id: '',
				role: UserRole.MEMBER,
				username: 'member',
				email: 'member@test.com',
				password: '123123123123',
				displayName: 'Admin user',
				firstName: 'string',
				lastName: 'string',
				gender: Gender.MALE,
				birthDate: new Date(),
				tel: '0888888888',
				address: {
					province: 'Can Tho',
					district: 'Ninh Kieu',
					commune: 'Xuan Khanh',
				} as unknown as UserAddress,
				status: UserStatus.ACTIVE,
				createdAt: new Date(),
				updatedAt: new Date(),
			} as User,
		},
	})
	@ApiResponse({
		status: 400,
		schema: {
			example: {
				code: '400',
				message: 'File size invalid',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 401,
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: '403',
				message: `Forbidden resource`,
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 404,
		schema: {
			example: {
				code: '404',
				message: 'Not found user with that ID',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 415,
		schema: {
			example: {
				code: '415',
				message: 'File invalid',
				details: null,
			} as ErrorResponse<null>,
		},
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
		console.log("file users avatar >> ", file)
		mkdirSync(dir, { recursive: true });
		writeFileSync(`${dir}/${fileName}`, file.buffer);
		const url: string = appConfig.fileHost + `/${id}/${fileName}`;

		return this.userService.updateAvatar(id, url);
	}
}
