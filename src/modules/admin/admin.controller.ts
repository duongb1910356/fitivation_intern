import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors,
	Req,
	ParseIntPipe,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiResponse,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
	Gender,
	User,
	UserRole,
	UserStatus,
} from '../users/schemas/user.schema';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import {
	ListOptions,
	ListResponse,
	ErrorResponse,
} from 'src/shared/response/common-response';
import { Attendance } from '../attendance/entities/attendance.entity';
import { Facility, Status } from '../facility/schemas/facility.schema';
import { CreateCategoryDto } from '../facility-category/dto/create-category-dto';
import { UpdateCategoryDto } from '../facility-category/dto/update-category-dto';
import { FacilityCategory } from '../facility-category/entities/facility-category';
import {
	ScheduleType,
	FacilitySchedule,
} from '../facility-schedule/entities/facility-schedule.entity';
import { OpenTime } from '../facility-schedule/entities/open-time.entity';
import { ShiftTime } from '../facility-schedule/entities/shift-time.entity';
import { Holiday } from '../holiday/entities/holiday.entity';
import { PackageType } from '../package-type/entities/package-type.entity';
import { TimeType, Package } from '../package/entities/package.entity';
import { UpdateFacilityStateDto } from './dto/update-facility-state-dto';
import { PackageTypeService } from '../package-type/package-type.service';
import { PackageService } from '../package/package.service';
import { FacilityCategoryService } from '../facility-category/facility-category.service';
import {
	ConditionSchedule,
	FacilityScheduleService,
} from '../facility-schedule/facility-schedule.service';
import { ConditionHoliday, HolidayService } from '../holiday/holiday.service';
import { AttendanceService } from '../attendance/attendance.service';
import { MongoIdValidationPipe } from 'src/pipes/parseMongoId.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateStatusFacilityDto } from '../facility/dto/update-status-facility';
import { FacilityService } from '../facility/facility.service';
import { Roles } from 'src/decorators/role.decorator';
import { RolesGuard } from 'src/guards/role.guard';
import { BillsService } from '../bills/bills.service';
import { UsersService } from '../users/users.service';
import { ListResponseV2, QueryObject } from 'src/shared/utils/query-api';
import { ApiDocsPaginationVer2 } from 'src/decorators/swagger-form-data.decorator-v2';
import { UserAddress } from '../users/schemas/user-address.schema';
import { CreateUserDto } from '../users/dto/create-user-dto';
import { UserAddressDto } from '../users/dto/user-address.dto';
import { UpdateUserDto } from '../users/dto/update-user-dto';

@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@ApiTags('admin')
@Controller('admin')
export class AdminController {
	constructor(
		private readonly packageTypeService: PackageTypeService,
		private readonly packageService: PackageService,
		private readonly facilityCategoryService: FacilityCategoryService,
		private readonly facilityScheduleService: FacilityScheduleService,
		private readonly holidayService: HolidayService,
		private readonly attendanceService: AttendanceService,
		private readonly facilityService: FacilityService,
		private readonly billService: BillsService,
		private readonly userService: UsersService,
	) {}
	//USERS
	@ApiOperation({
		summary: 'Get Quantity Users Statistic',
		description: `Get quantity users of system (exclude admin account).\n\nRoles: ${UserRole.ADMIN}.`,
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				data: {
					numberUsers: 1,
				},
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
	@Get('users/statics/quantity-users')
	@Roles(UserRole.ADMIN)
	@UseGuards(RolesGuard)
	async getQuantityUsersStats(): Promise<object> {
		return await this.userService.getQuantityUsersStats();
	}

	@ApiOperation({
		summary: 'Get Quantity Customers Statistic',
		description: `Get quantity customers of system).\n\nRoles: ${UserRole.ADMIN}.`,
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				data: {
					numberCustomers: 1,
				},
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
	@Get('users/statics/quantity-customers')
	@Roles(UserRole.ADMIN)
	@UseGuards(RolesGuard)
	async getQuantityCustomersStats(): Promise<object> {
		return await this.userService.getQuantityCustomersStats();
	}

	@ApiOperation({
		summary: 'Get Quantity Facility Owners Statistic',
		description: `Get quantity facility owners of system).\n\nRoles: ${UserRole.ADMIN}.`,
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				data: {
					numerFacilityOwners: 1,
				},
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
	@Get('users/statics/quantity-owners')
	@Roles(UserRole.ADMIN)
	@UseGuards(RolesGuard)
	async getQuantityFacilityOwnersStats(): Promise<object> {
		return await this.userService.getQuantityFacilityOwnersStats();
	}

	@ApiDocsPaginationVer2('user')
	@ApiOperation({
		summary: 'Find Many Users',
		description: `Find many users.\n\nRoles: ${UserRole.ADMIN}.`,
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				data: {
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
				} as ListResponseV2<User>,
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
	@Get('users')
	@Roles(UserRole.ADMIN)
	@UseGuards(RolesGuard)
	async findManyUsers(
		@Query() query: QueryObject,
	): Promise<ListResponseV2<User>> {
		return await this.userService.findMany(query);
	}

	@ApiOperation({
		summary: 'Find User By ID',
		description: `Get one user by ID.\n\nRoles: ${UserRole.ADMIN}.`,
	})
	@ApiParam({ name: 'id', type: String, description: 'User ID' })
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
	@Get('users/:id')
	@Roles(UserRole.ADMIN)
	@UseGuards(RolesGuard)
	async findUserByID(@Param('id') id: string): Promise<User> {
		return await this.userService.findOneByID(id);
	}

	@ApiOperation({
		summary: 'Create User',
		description: `Create new user\n\nRoles: ${UserRole.ADMIN}.`,
	})
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
	@Post('users')
	@Roles(UserRole.ADMIN)
	@UseGuards(RolesGuard)
	async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
		return await this.userService.createOne(createUserDto);
	}

	@ApiOperation({
		summary: 'Update User',
		description: `Update user information.\n\nRoles: ${UserRole.ADMIN}.`,
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
	@Patch('users/:id')
	@Roles(UserRole.ADMIN)
	@UseGuards(RolesGuard)
	async updateUser(
		@Body() dto: UpdateUserDto,
		@Param('id') id: string,
	): Promise<User> {
		return await this.userService.findOneByIDAndUpdate(id, dto);
	}

	@ApiOperation({
		summary: 'Delete User',
		description: `Delete user by ID.\n\nRoles: ${UserRole.ADMIN}.`,
	})
	@ApiParam({ name: 'id', type: String, description: 'User ID' })
	@ApiResponse({
		status: 200,
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
	@Delete('users/:id')
	@Roles(UserRole.ADMIN)
	@UseGuards(RolesGuard)
	async deleteUser(@Param('id') id: string): Promise<boolean> {
		return await this.userService.deleteOne(id);
	}

	//BILLS
	@ApiOperation({
		summary: 'Get Quantity Bills Statistic',
		description: `Get quantity bills statistic of system.\n\nRoles: ${UserRole.ADMIN}.`,
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				data: {
					numerBills: 1,
				},
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
	@Get('bills/statics/quantity')
	@Roles(UserRole.ADMIN)
	@UseGuards(RolesGuard)
	async getQuantityBillsStats(): Promise<object> {
		return await this.billService.getQuantityBillsStats();
	}

	@ApiOperation({
		summary: 'Get Yearly Bills Statistic',
		description: `Get yearly bills statistic of system.\n\nRoles: ${UserRole.ADMIN}.`,
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				data: [
					{
						numberBills: 7,
						totalPrice: 3940000,
						avgTotalPrice: 562857.1428571428,
						minPrice: 140000,
						maxPrice: 1830000,
						year: 2023,
					},
					{
						numberBills: 1,
						totalPrice: 1680000,
						avgTotalPrice: 1680000,
						minPrice: 1680000,
						maxPrice: 1680000,
						year: 2022,
					},
					{
						numberBills: 1,
						totalPrice: 300000,
						avgTotalPrice: 300000,
						minPrice: 300000,
						maxPrice: 300000,
						year: 2021,
					},
				],
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
	@Get('bills/statics/yearly')
	@Roles(UserRole.ADMIN)
	@UseGuards(RolesGuard)
	async getYearlyBillStats(): Promise<Array<object>> {
		return await this.billService.getYearlyBillStats();
	}

	@ApiOperation({
		summary: 'Get Monthly Bills Statistic',
		description: `Get monthly bills statistic of system.\n\nRoles: ${UserRole.ADMIN}.`,
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				data: [
					{
						numberBills: 3,
						totalPrice: 2820000,
						avgTotalPrice: 940000,
						minPrice: 150000,
						maxPrice: 1830000,
						month: 3,
					},
					{
						numberBills: 1,
						totalPrice: 420000,
						avgTotalPrice: 420000,
						minPrice: 420000,
						maxPrice: 420000,
						month: 2,
					},
					{
						numberBills: 3,
						totalPrice: 700000,
						avgTotalPrice: 233333.33333333334,
						minPrice: 140000,
						maxPrice: 420000,
						month: 1,
					},
				],
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
	@Get('bills/statics/monthly/:year')
	@Roles(UserRole.ADMIN)
	@UseGuards(RolesGuard)
	async getMonthlyBillStats(
		@Param('year', ParseIntPipe) year: number,
	): Promise<Array<object>> {
		return await this.billService.getMonthlyBillStats(year);
	}

	@ApiOperation({
		summary: 'Delete Bill',
		description: `Allow admin to delete one bill.\n\nRoles: ${UserRole.ADMIN}.`,
	})
	@ApiParam({ name: 'id', type: String, description: 'Bill ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: { data: true },
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
	@Delete('bills/:id')
	@Roles(UserRole.ADMIN)
	@UseGuards(RolesGuard)
	async deleteBill(@Param('id') id: string): Promise<boolean> {
		return await this.billService.deleteOneByID(id);
	}

	//FACILITIES

	@Patch('facilities/:facilityID/changeStatus')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Update facility status',
		description: `Only admin can use this API`,
	})
	@ApiParam({
		name: 'facilityID',
		type: String,
		description: 'Facility ID',
	})
	@ApiBody({
		type: UpdateFacilityStateDto,
		examples: {
			ACTIVE: {
				summary: 'ACTIVE',
				value: {
					status: Status.APPROVED,
				} as UpdateStatusFacilityDto,
			},
			PENDING: {
				summary: 'PENDING',
				value: {
					status: Status.PENDING,
				} as UpdateStatusFacilityDto,
			},
		},
	})
	@ApiOkResponse({
		schema: {
			example: {
				message: 'Update facility state successful!',
			},
		},
	})
	@ApiUnauthorizedResponse({
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiForbiddenResponse({
		schema: {
			example: {
				code: '403',
				message: 'Forbidden resource',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiNotFoundResponse({
		schema: {
			example: {
				code: '404',
				message: 'Not found facility to update!',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiBadRequestResponse({
		schema: {
			example: {
				code: '400',
				message: '[Input] invalid!',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	updateFacilityState(
		@Param('facilityID', MongoIdValidationPipe) facilityID: string,
		@Body() data: UpdateStatusFacilityDto,
		@Req() req: any,
	) {
		console.log('data ', data);
		return this.facilityService.updateStatus(facilityID, req, data.status);
	}

	@ApiBearerAuth()
	@Get('facilities/statistics')
	@ApiOkResponse({
		schema: {
			example: {
				pendingFacility: 0,
				rejectFacility: 0,
				approveFacility: 0,
			},
		},
	})
	getFacilityStatistics(@Req() req: any) {
		return this.facilityService.getFacilityStatistics(req);
	}

	// ATTENDANCES
	@Get('facillities/:facilityID/attendances')
	@ApiOperation({
		summary: 'Get All Attendances by facilityID',
		description: `Only admin can use this API`,
	})
	@ApiParam({
		name: 'facilityID',
		type: String,
		description: 'Facility ID',
	})
	@ApiDocsPagination('Attendance')
	@ApiOkResponse({
		schema: {
			example: {
				items: [
					{
						_id: '6476ef7d1f0419cd330fe128',
						facilityID: {} as unknown as Facility,
						accountID: {} as unknown as User,
						date: [],
						createdAt: new Date(),
						updatedAt: new Date(),
					} as Attendance,
				],
				total: 1,
				options: {
					limit: 10,
					offset: 0,
					searchField: 'facilityID',
					searchValue: 'string',
					sortField: 'accountID',
					sortOrder: 'asc',
				} as ListOptions<Attendance>,
			} as ListResponse<Attendance>,
		},
	})
	@ApiUnauthorizedResponse({
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiForbiddenResponse({
		schema: {
			example: {
				code: '403',
				message: 'Forbidden resource',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	async getAllAttendancesByFacility(
		@Query() options: ListOptions<Attendance>,
		@Param('facilityID', MongoIdValidationPipe) facilityID: string,
	) {
		return await this.attendanceService.findMany({ facilityID }, options);
	}

	@Get('users/:userID/attendances')
	@ApiOperation({
		summary: 'Get All Attendances by userID',
		description: `Only admin can use this API`,
	})
	@ApiParam({
		name: 'userID',
		type: String,
		description: 'User ID',
	})
	@ApiDocsPagination('Attendance')
	@ApiOkResponse({
		schema: {
			example: {
				items: [
					{
						_id: '6476ef7d1f0419cd330fe128',
						facilityID: {} as unknown as Facility,
						accountID: {} as unknown as User,
						date: [],
						createdAt: new Date(),
						updatedAt: new Date(),
					} as Attendance,
				],
				total: 1,
				options: {
					limit: 10,
					offset: 0,
					searchField: 'facilityID',
					searchValue: 'string',
					sortField: 'accountID',
					sortOrder: 'asc',
				} as ListOptions<Attendance>,
			} as ListResponse<Attendance>,
		},
	})
	@ApiUnauthorizedResponse({
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiForbiddenResponse({
		schema: {
			example: {
				code: '403',
				message: 'Forbidden resource',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	async getAllAttendancesByUser(
		@Query() options: ListOptions<Attendance>,
		@Param('userID', MongoIdValidationPipe) userID: string,
	) {
		return await this.attendanceService.findMany(
			{ accountID: userID },
			options,
		);
	}

	@Delete('attendances/:attendanceID')
	@ApiOperation({
		summary: 'Delete Attendance by attendanceID',
		description: `Only Admin can use this API`,
	})
	@ApiParam({
		name: 'attendanceID',
		type: String,
		description: 'Attendance ID',
	})
	@ApiOkResponse({
		schema: {
			example: {
				message: 'Delete Attendance successful!',
			},
		},
	})
	@ApiUnauthorizedResponse({
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiForbiddenResponse({
		schema: {
			example: {
				code: '403',
				message: 'Forbidden resource',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiNotFoundResponse({
		schema: {
			example: {
				code: '404',
				message: 'Holiday not found!',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiBadRequestResponse({
		schema: {
			example: {
				code: '400',
				message: '[Input] invalid!',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	async deteleAttendance(
		@Param('attendanceID', MongoIdValidationPipe) attendanceID: string,
	) {
		return await this.attendanceService.delete(attendanceID);
	}

	// CATEGORIES
	@Post('categories')
	@ApiOperation({
		summary: 'Create category',
		description: `Only admin can use this API`,
	})
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				photo: {
					description: 'Photo not check Send empty value',
					type: 'string',
					format: 'binary',
				},
				type: { type: 'string' },
				name: { type: 'string' },
			},
		},
	})
	@ApiCreatedResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				type: 'SPA',
				name: 'SPA',
				createdAt: new Date(),
				updatedAt: new Date(),
			} as FacilityCategory,
		},
	})
	@ApiUnauthorizedResponse({
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiForbiddenResponse({
		schema: {
			example: {
				code: '403',
				message: 'Forbidden resource',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiBadRequestResponse({
		schema: {
			example: {
				code: '400',
				message: '[Input] invalid!',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@UseInterceptors(FileInterceptor('photo'))
	async createCategory(
		@Body() data: CreateCategoryDto,
		@UploadedFile() photo: Express.Multer.File,
	) {
		if (!photo) throw new BadRequestException('Photo not empty');
		return await this.facilityCategoryService.create(data, photo);
	}

	@Patch('categories/:categoryID')
	@ApiOperation({
		summary: 'Update category',
		description: `Only admin can use this API`,
	})
	@ApiParam({
		name: 'categoryID',
		type: String,
		description: 'Category ID',
	})
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				photo: {
					description: 'Photo not check Send empty value',
					type: 'string',
					format: 'binary',
				},
				name: { type: 'string' },
				type: { type: 'string' },
			},
		},
	})
	@ApiOkResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				type: 'GYM1',
				name: 'GYM1',
				createdAt: new Date(),
				updatedAt: new Date(),
			} as FacilityCategory,
		},
	})
	@ApiUnauthorizedResponse({
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiForbiddenResponse({
		schema: {
			example: {
				code: '403',
				message: 'Forbidden resource',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiNotFoundResponse({
		schema: {
			example: {
				code: '404',
				message: 'Not found category to update!',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiBadRequestResponse({
		schema: {
			example: {
				code: '400',
				message: '[Input] invalid!',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@UseInterceptors(FileInterceptor('photo'))
	async updateCategory(
		@Param('categoryID', MongoIdValidationPipe) categoryID: string,
		@Body() data: UpdateCategoryDto,
		@UploadedFile() photo: Express.Multer.File,
	) {
		return await this.facilityCategoryService.update(categoryID, data, photo);
	}

	@Delete('categories/:categoryID')
	@ApiOperation({
		summary: 'Delete category',
		description: `Only admin can use this API`,
	})
	@ApiParam({
		name: 'categoryID',
		type: String,
		description: 'Category ID',
	})
	@ApiOkResponse({
		schema: {
			example: {
				message: 'Delete Category successful!',
			},
		},
	})
	@ApiUnauthorizedResponse({
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiForbiddenResponse({
		schema: {
			example: {
				code: '403',
				message: 'Forbidden resource',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiNotFoundResponse({
		schema: {
			example: {
				code: '404',
				message: 'Category not found!',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiBadRequestResponse({
		schema: {
			example: {
				code: '400',
				message: '[Input] invalid!',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	deleteCategory(
		@Param('categoryID', MongoIdValidationPipe) categoryID: string,
	) {
		return this.facilityCategoryService.delete(categoryID);
	}

	//SCHEDULES
	@Get('schedules')
	@ApiOperation({
		summary: 'Get All Schedules',
		description: `Only admin can use this API`,
	})
	@ApiQuery({
		name: 'facilityID',
		type: String,
		required: false,
		description: 'facilityID',
	})
	@ApiQuery({
		name: 'type',
		type: String,
		required: false,
		description: 'Schedule Type',
	})
	@ApiDocsPagination('Schedule')
	@ApiOkResponse({
		schema: {
			example: {
				items: [
					{
						_id: '6476ef7d1f0419cd330fe128',
						facilityID: {} as unknown as Facility,
						type: ScheduleType.DAILY,
						openTime: [
							{
								shift: [
									{
										startTime: '06:00',
										endTime: '12:00',
									},
									{
										startTime: '13:00',
										endTime: '19:00',
									},
								] as ShiftTime[],
							},
						] as OpenTime[],
						createdAt: new Date(),
						updatedAt: new Date(),
					} as FacilitySchedule,
				],
				total: 1,
				options: {
					limit: 10,
					offset: 0,
					searchField: 'facilityID',
					searchValue: 'string',
					sortField: 'type',
					sortOrder: 'asc',
				} as ListOptions<FacilitySchedule>,
			} as ListResponse<FacilitySchedule>,
		},
	})
	@ApiUnauthorizedResponse({
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiForbiddenResponse({
		schema: {
			example: {
				code: '403',
				message: 'Forbidden resource',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	async getAllSchedules(@Query() options: ListOptions<FacilitySchedule>) {
		let condition: ConditionSchedule;
		if (options.facilityID) {
			condition = {
				facilityID: options.facilityID.toString(),
			};
		}
		if (options.type) {
			condition = {
				...condition,
				type: options.type,
			};
		}
		return await this.facilityScheduleService.findMany(condition, options);
	}

	//HOLIDAYS
	@Get('holidays')
	@ApiOperation({
		summary: 'Get All Holidays',
		description: `Only admin can use this API`,
	})
	@ApiDocsPagination('Holiday')
	@ApiQuery({
		name: 'startDate',
		type: String,
		required: false,
		description: 'startDate',
	})
	@ApiQuery({
		name: 'endDate',
		type: String,
		required: false,
		description: 'endDate',
	})
	@ApiQuery({
		name: 'facilityID',
		type: String,
		required: false,
		description: 'facilityID',
	})
	@ApiOkResponse({
		schema: {
			example: {
				items: [
					{
						_id: '6476ef7d1f0419cd330fe128',
						facilityID: {} as unknown as Facility,
						startDate: new Date(),
						endDate: new Date(),
						content: 'string',
						createdAt: new Date(),
						updatedAt: new Date(),
					} as Holiday,
				],
				total: 1,
				options: {
					limit: 10,
					offset: 0,
					searchField: 'facilityID',
					searchValue: 'string',
					sortField: 'startDate',
					sortOrder: 'asc',
				} as ListOptions<Holiday>,
			} as ListResponse<Holiday>,
		},
	})
	@ApiUnauthorizedResponse({
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiForbiddenResponse({
		schema: {
			example: {
				code: '403',
				message: 'Forbidden resource',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	async getAllHolidays(@Query() options: ListOptions<Holiday>) {
		let condition: ConditionHoliday = {};
		if (options.facilityID) {
			condition = {
				facilityID: options.facilityID.toString(),
			};
		}
		if (options.startDate) {
			condition = {
				...condition,
				startDate: { $gte: options.startDate },
			};
		}
		if (options.endDate) {
			condition = {
				...condition,
				endDate: { $lte: options.endDate },
			};
		}
		return await this.holidayService.findMany(condition, options);
	}

	//PACKAGES
	@Get('packages')
	@ApiOperation({
		summary: 'Get All Packages',
		description: `Only admin can use this API`,
	})
	@ApiDocsPagination('Package')
	@ApiOkResponse({
		schema: {
			example: {
				items: [
					{
						_id: '6476ef7d1f0419cd330fe128',
						packageTypeID: {} as unknown as PackageType,
						facilityID: {} as unknown as Facility,
						type: TimeType.ONE_MONTH,
						price: 100000,
						benefits: ['Use of bathroom', 'Use of massage chair'],
						createdAt: new Date(),
						updatedAt: new Date(),
					} as Package,
				],
				total: 1,
				options: {
					limit: 10,
					offset: 0,
					searchField: 'facilityID',
					searchValue: 'string',
					sortField: '_id',
					sortOrder: 'asc',
				} as ListOptions<Package>,
			} as ListResponse<Package>,
		},
	})
	@ApiUnauthorizedResponse({
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiForbiddenResponse({
		schema: {
			example: {
				code: '403',
				message: 'Forbidden resource',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	async getAllPackages(@Query() filter: ListOptions<Package>) {
		return await this.packageService.findMany(filter);
	}

	//PACKAGE TYPE
	@Get('package-types')
	@ApiOperation({
		summary: 'Get All Package Type',
		description: `Only admin can use this API`,
	})
	@ApiDocsPagination('PackageType')
	@ApiOkResponse({
		schema: {
			example: {
				items: [
					{
						_id: '6476ef7d1f0419cd330fe128',
						facilityID: {} as unknown as Facility,
						name: 'GYM GYM 1',
						description: 'cơ sở tập gym chất lượng',
						price: 100000,
						order: 0,
						createdAt: new Date(),
						updatedAt: new Date(),
					} as PackageType,
				],
				total: 1,
				options: {
					limit: 10,
					offset: 0,
					searchField: 'name',
					searchValue: 'string',
					sortField: 'name',
					sortOrder: 'asc',
				} as ListOptions<PackageType>,
			} as ListResponse<PackageType>,
		},
	})
	@ApiUnauthorizedResponse({
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiForbiddenResponse({
		schema: {
			example: {
				code: '403',
				message: 'Forbidden resource',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	async getAllPackageTypes(
		@Query() filter: ListOptions<PackageType>,
	): Promise<ListResponse<PackageType>> {
		return await this.packageTypeService.findMany(filter);
	}
}
