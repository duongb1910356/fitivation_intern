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
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { mkdirSync, writeFileSync } from 'fs';
import { appConfig } from '../../app.config';
import { GenFileName } from '../../shared/utils/gen-filename';
import { AvatarUploadDto } from './dto/avatar-upload-dto';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { Gender, User, UserRole, UserStatus } from './schemas/user.schema';
import { UsersService } from './users.service';
import { UserAddressDto } from './dto/user-address.dto';
import { UserAddress } from './schemas/user-address.schema';
import { ErrorResponse } from 'src/shared/response/common-response';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import { TokenResponse } from '../auth/types/token-response.types';
import { ListResponse, QueryObject } from 'src/shared/utils/query-api';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { UpdateLoggedUserDataDto } from './dto/update-logged-user-data-dto';
import { UpdateLoggedUserPasswordDto } from './dto/update-logged-user-password-dto';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
	constructor(private userService: UsersService) {}

	@ApiOperation({
		summary: 'getProfile',
		description: 'Get loggedIn user info',
	})
	@ApiResponse({
		type: User,
		status: 200,
		schema: {
			example: {
				_id: 'string',
				role: UserRole.MEMBER,
				username: 'member1',
				email: 'member@test.com',
				password: 'string',
				displayName: 'Admin user',
				firstName: 'string',
				lastName: 'string',
				gender: Gender.MALE,
				birthDate: new Date(),
				tel: '0987654321',
				address: {
					province: 'Can Tho',
					district: 'Ninh Kieu',
					commune: 'Xuan Khanh',
				} as unknown as UserAddress,
				isMember: false,
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
				message: 'Token invalid',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@Get('me')
	@Roles(UserRole.ADMIN, UserRole.FACILITY_OWNER, UserRole.MEMBER)
	@UseGuards(RolesGuard)
	async getProfile(@GetCurrentUser('sub') userID: string) {
		return await this.userService.getCurrentUser(userID);
	}

	@ApiDocsPagination('user')
	@ApiOperation({ summary: 'findManyUsers', description: 'Get many users' })
	@ApiResponse({
		schema: {
			example: {
				items: [
					{
						_id: 'string',
						role: UserRole.MEMBER,
						username: 'member',
						email: 'member@test.com',
						password: 'string',
						displayName: 'Admin user',
						firstName: 'string',
						lastName: 'string',
						gender: Gender.MALE,
						birthDate: new Date(),
						tel: '0987654321',
						address: {
							province: 'Can Tho',
							district: 'Ninh Kieu',
							commune: 'Xuan Khanh',
						} as unknown as UserAddress,
						isMember: false,
						status: UserStatus.ACTIVE,
						createdAt: new Date(),
						updatedAt: new Date(),
					} as User,
				],
				total: 1,
				queryOptions: {
					sort: 'string',
					fields: 'string',
					limit: 10,
					page: 0,
				} as QueryObject,
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
	@Get()
	@Roles(UserRole.ADMIN)
	@UseGuards(RolesGuard)
	async findManyUsers(
		@Query() query: QueryObject,
	): Promise<ListResponse<User>> {
		return await this.userService.findMany(query);
	}

	@ApiOperation({ summary: 'findUserByID', description: 'Get one user by ID' })
	@ApiParam({ name: 'id', type: String, description: 'User ID' })
	@ApiOkResponse({
		schema: {
			example: {
				_id: 'string',
				role: UserRole.MEMBER,
				username: 'member',
				email: 'member@test.com',
				password: 'string',
				displayName: 'Admin user',
				firstName: 'string',
				lastName: 'string',
				gender: Gender.MALE,
				birthDate: new Date(),
				tel: '0987654321',
				address: {
					province: 'Can Tho',
					district: 'Ninh Kieu',
					commune: 'Xuan Khanh',
				} as unknown as UserAddress,
				isMember: false,
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
	@Get(':id')
	@Roles(UserRole.ADMIN)
	@UseGuards(RolesGuard)
	async findUserByID(@Param('id') id: string): Promise<User> {
		return await this.userService.findOneByID(id);
	}

	@ApiOperation({ summary: 'createUser', description: 'Create new user' })
	@ApiBody({
		type: CreateUserDto,
		examples: {
			ADMIN: {
				summary: 'Admin account',
				value: {
					role: UserRole.ADMIN,
					username: 'admin',
					email: 'admin@test.com',
					password: '123123123',
					displayName: 'Admin User',
					firstName: 'string',
					lastName: 'string',
					gender: Gender.MALE,
					birthDate: new Date(),
					tel: '0987654321',
					address: {
						province: 'Can Tho',
						district: 'Ninh Kieu',
						commune: 'Xuan Khanh',
					} as UserAddressDto,
					isMember: false,
				} as CreateUserDto,
			},
			CUSTOMER: {
				summary: 'Customer account',
				value: {
					role: UserRole.MEMBER,
					username: 'customer1',
					email: 'customer1@test.com',
					password: '123123123',
					displayName: 'Customer User',
					firstName: 'string',
					lastName: 'string',
					gender: Gender.MALE,
					birthDate: new Date(),
					tel: '0987654321',
					address: {
						province: 'Can Tho',
						district: 'Ninh Kieu',
						commune: 'Xuan Khanh',
					} as UserAddressDto,
					isMember: false,
				} as CreateUserDto,
			},
			FACILITY_OWNER: {
				summary: 'Facility owner account',
				value: {
					role: UserRole.FACILITY_OWNER,
					username: 'facility-owner1',
					email: 'owner1@test.com',
					password: '123123123',
					displayName: 'Facility Owner User',
					firstName: 'string',
					lastName: 'string',
					gender: Gender.MALE,
					birthDate: new Date(),
					tel: '0987654321',
					address: {
						province: 'Can Tho',
						district: 'Ninh Kieu',
						commune: 'Xuan Khanh',
					} as UserAddressDto,
					isMember: false,
				} as CreateUserDto,
			},
		},
	})
	@ApiCreatedResponse({
		schema: {
			example: {
				code: 201,
				message: 'Success',
				data: {
					_id: 'string',
					role: UserRole.MEMBER,
					username: 'member',
					email: 'member@test.com',
					password: 'string',
					displayName: 'Admin user',
					firstName: 'string',
					lastName: 'string',
					gender: Gender.MALE,
					birthDate: new Date(),
					tel: '0987654321',
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
	@Post()
	@Roles(UserRole.ADMIN)
	@UseGuards(RolesGuard)
	async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
		return await this.userService.createOne(createUserDto);
	}

	@ApiOperation({
		summary: 'updateMyData',
		description:
			'Allow user update personal account data but (this endpoint does not use to update password)',
	})
	@ApiCreatedResponse({ type: TokenResponse, status: 200 })
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
	@Patch('update-me')
	@Roles(UserRole.ADMIN, UserRole.FACILITY_OWNER, UserRole.MEMBER)
	@UseGuards(RolesGuard)
	async updateMyData(
		@GetCurrentUser('sub') userID: string,
		@Body() dto: UpdateLoggedUserDataDto,
	): Promise<User> {
		return await this.userService.updateMyData(userID, dto);
	}

	@ApiOperation({
		summary: 'updatePassword',
		description: 'Allow current user update password',
	})
	@ApiCreatedResponse({ type: TokenResponse, status: 200 })
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
	@Patch('update-my-password')
	@Roles(UserRole.ADMIN, UserRole.FACILITY_OWNER, UserRole.MEMBER)
	@UseGuards(RolesGuard)
	async updateMyPassword(
		@GetCurrentUser('sub') userID: string,
		@Body() dto: UpdateLoggedUserPasswordDto,
	): Promise<boolean> {
		return await this.userService.updateMyPassword(userID, dto);
	}

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
					tel: '0987654321',
					address: {
						province: 'Can Tho',
						district: 'Ninh Kieu',
						commune: 'Xuan Khanh',
					} as unknown as UserAddress,
					isMember: false,
					status: UserStatus.ACTIVE,
				},
			},
		},
	})
	@ApiOkResponse({
		schema: {
			example: {
				_id: 'string',
				role: UserRole.MEMBER,
				username: 'member',
				email: 'member@test.com',
				password: 'string',
				displayName: 'Admin user',
				firstName: 'string',
				lastName: 'string',
				gender: Gender.MALE,
				birthDate: new Date(),
				tel: '0987654321',
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
	@Patch('/:id')
	@Roles(UserRole.ADMIN)
	@UseGuards(RolesGuard)
	async updateUser(
		@Body() dto: UpdateUserDto,
		@Param('id') id: string,
	): Promise<User> {
		return await this.userService.findOneByIDAndUpdate(id, dto);
	}

	@ApiOperation({
		summary: 'deleteMe',
		description: 'Allow user inactive personal account data',
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				code: '200',
				message: 'This account will delete after 15 days no login',
				details: null,
			},
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
	@Delete('delete-me')
	@Roles(UserRole.FACILITY_OWNER, UserRole.MEMBER)
	@UseGuards(RolesGuard)
	async deleteMe(@GetCurrentUser('sub') userID: string): Promise<boolean> {
		return await this.userService.deleteMe(userID);
	}

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
	@Delete(':id')
	@Roles(UserRole.ADMIN)
	@UseGuards(RolesGuard)
	async deleteUser(@Param('id') id: string): Promise<boolean> {
		return await this.userService.deleteOne(id);
	}

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
				_id: 'string',
				role: UserRole.MEMBER,
				username: 'member',
				email: 'member@test.com',
				password: 'string',
				displayName: 'Admin user',
				firstName: 'string',
				lastName: 'string',
				gender: Gender.MALE,
				birthDate: new Date(),
				tel: '0987654321',
				address: {
					province: 'Can Tho',
					district: 'Ninh Kieu',
					commune: 'Xuan Khanh',
				} as unknown as UserAddress,
				isMember: false,
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
	@Post(':id/avatar')
	@Roles(UserRole.ADMIN, UserRole.FACILITY_OWNER, UserRole.MEMBER)
	@UseGuards(RolesGuard)
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
		console.log('file users avatar >> ', file);
		mkdirSync(dir, { recursive: true });
		writeFileSync(`${dir}/${fileName}`, file.buffer);
		const url: string = appConfig.fileHost + `/${id}/${fileName}`;

		return this.userService.updateAvatar(id, url);
	}
}
