import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { Gender, User, UserRole, UserStatus } from './schemas/user.schema';
import { UsersService } from './users.service';
import { UserAddress } from './schemas/user-address.schema';
import { ErrorResponse } from 'src/shared/response/common-response';
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
		summary: 'Get Profile',
		description: `Get current login user info.\n\nRoles: ${UserRole.ADMIN}, ${UserRole.FACILITY_OWNER}, ${UserRole.MEMBER}.`,
	})
	@ApiResponse({
		type: User,
		status: 200,
		schema: {
			example: {
				data: {
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
	async getProfile(@GetCurrentUser('sub') userID: string): Promise<User> {
		return await this.userService.getCurrentUser(userID);
	}

	@Patch(':userID/avatar')
	@ApiOperation({
		summary: 'Update Avatar',
		description: `Update user's avatar.\n\nRoles: ${UserRole.ADMIN}, ${UserRole.FACILITY_OWNER}, ${UserRole.MEMBER}.`,
	})
	@ApiConsumes('multipart/form-data')
	@ApiParam({ name: 'userID', type: String, description: 'User ID' })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
					description: 'accept: jpeg|png',
				},
			},
		},
	})
	@ApiOkResponse({
		schema: {
			example: {
				data: true,
			},
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
	@Roles(UserRole.ADMIN, UserRole.FACILITY_OWNER, UserRole.MEMBER)
	@UseGuards(RolesGuard)
	@UseInterceptors(FileInterceptor('file'))
	async updateAvatar(
		@Param('userID') userID: string,
		@UploadedFile()
		file: Express.Multer.File,
	): Promise<boolean> {
		return await this.userService.updateAvatar(userID, file);
	}

	@ApiOperation({
		summary: 'Update My Data (not password)',
		description: `Allow user update personal account data but (this endpoint does not use to update password).\n\nRoles: ${UserRole.ADMIN}, ${UserRole.FACILITY_OWNER}, ${UserRole.MEMBER}.`,
	})
	@ApiBody({
		type: UpdateLoggedUserDataDto,
		examples: {
			example1: {
				value: {
					username: 'string',
					email: 'string',
					displayName: 'string',
					firstName: 'string',
					lastName: 'string',
					gender: 'string',
					birthDate: 'string',
					tel: 'string',
					address: 'string',
				},
			},
		},
	})
	@ApiOkResponse({
		schema: {
			example: {
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
					isMember: false,
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
		summary: 'Update Password',
		description: `Allow current user update password\n\nRoles: ${UserRole.ADMIN}, ${UserRole.FACILITY_OWNER}, ${UserRole.MEMBER}.`,
	})
	@ApiBody({
		type: UpdateLoggedUserPasswordDto,
		examples: {
			example1: {
				value: {
					password: 'string',
				},
			},
		},
	})
	@ApiOkResponse({
		schema: {
			example: {
				data: true,
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
		summary: 'Delete Me',
		description: `Allow user inactive personal account data.\n\nRoles: ${UserRole.FACILITY_OWNER}, ${UserRole.MEMBER}.`,
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				data: true,
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

	// @ApiOperation({
	// 	summary: 'uploadFile',
	// 	description: 'Upload user avatar file',
	// })
	// @UseInterceptors(FileInterceptor('avatar'))
	// @ApiConsumes('multipart/form-data')
	// @ApiParam({ name: 'id', type: String, description: 'User ID' })
	// @ApiBody({ type: AvatarUploadDto })
	// @ApiOkResponse({
	// 	schema: {
	// 		example: {
	// 			_id: 'string',
	// 			role: UserRole.MEMBER,
	// 			username: 'member',
	// 			email: 'member@test.com',
	// 			password: 'string',
	// 			displayName: 'Admin user',
	// 			firstName: 'string',
	// 			lastName: 'string',
	// 			gender: Gender.MALE,
	// 			birthDate: new Date(),
	// 			tel: '0987654321',
	// 			address: {
	// 				province: 'Can Tho',
	// 				district: 'Ninh Kieu',
	// 				commune: 'Xuan Khanh',
	// 			} as unknown as UserAddress,
	// 			isMember: false,
	// 			status: UserStatus.ACTIVE,
	// 			createdAt: new Date(),
	// 			updatedAt: new Date(),
	// 		} as User,
	// 	},
	// })
	// @ApiResponse({
	// 	status: 400,
	// 	schema: {
	// 		example: {
	// 			code: '400',
	// 			message: 'File size invalid',
	// 			details: null,
	// 		} as ErrorResponse<null>,
	// 	},
	// })
	// @ApiResponse({
	// 	status: 401,
	// 	schema: {
	// 		example: {
	// 			code: '401',
	// 			message: 'Unauthorized',
	// 			details: null,
	// 		} as ErrorResponse<null>,
	// 	},
	// })
	// @ApiResponse({
	// 	status: 403,
	// 	schema: {
	// 		example: {
	// 			code: '403',
	// 			message: `Forbidden resource`,
	// 			details: null,
	// 		} as ErrorResponse<null>,
	// 	},
	// })
	// @ApiResponse({
	// 	status: 404,
	// 	schema: {
	// 		example: {
	// 			code: '404',
	// 			message: 'Not found user with that ID',
	// 			details: null,
	// 		} as ErrorResponse<null>,
	// 	},
	// })
	// @ApiResponse({
	// 	status: 415,
	// 	schema: {
	// 		example: {
	// 			code: '415',
	// 			message: 'File invalid',
	// 			details: null,
	// 		} as ErrorResponse<null>,
	// 	},
	// })
	// @Post(':id/avatar')
	// // @Roles(UserRole.ADMIN, UserRole.FACILITY_OWNER, UserRole.MEMBER)
	// // @UseGuards(RolesGuard)
	// uploadFile(
	// 	@Param('id') id,
	// 	@UploadedFile(
	// 		new ParseFilePipe({
	// 			validators: [
	// 				new MaxFileSizeValidator({ maxSize: 1000 * 1000 }), // 1MB
	// 				new FileTypeValidator({ fileType: /(?:jpeg|png)/i }),
	// 			],
	// 		}),
	// 	)
	// 	file: Express.Multer.File,
	// ) {
	// 	const dir = `${appConfig.fileRoot}/${id}`;
	// 	const fileName = GenFileName.gen(file.mimetype);
	// 	console.log('file users avatar >> ', file);
	// 	mkdirSync(dir, { recursive: true });
	// 	writeFileSync(`${dir}/${fileName}`, file.buffer);
	// 	const url: string = appConfig.fileHost + `/${id}/${fileName}`;

	// 	// 	return this.userService.updateAvatar(id, url);
	// 	// }
	// }
}
