import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/role.decorator';
import { RolesGuard } from 'src/guards/role.guard';
import { User, UserRole } from '../users/schemas/user.schema';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import {
	ListOptions,
	ListResponse,
	ErrorResponse,
} from 'src/shared/response/common-response';
import { Attendance } from '../attendance/entities/attendance.entity';
import { Facility, State } from '../facility/schemas/facility.schema';
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
import { Public } from '../auth/utils';
import { PackageService } from '../package/package.service';
import { FacilityCategoryService } from '../facility-category/facility-category.service';
import {
	ConditionSchedule,
	FacilityScheduleService,
} from '../facility-schedule/facility-schedule.service';
import { ConditionHoliday, HolidayService } from '../holiday/holiday.service';

@ApiTags('admin')
// @ApiBearerAuth()
// @UseGuards(RolesGuard)
// @Roles(UserRole.ADMIN)
@Public()
@Controller('admin')
export class AdminController {
	constructor(
		private readonly packageTypeService: PackageTypeService,
		private readonly packageService: PackageService,
		private readonly facilityCategoryService: FacilityCategoryService,
		private readonly facilityScheduleService: FacilityScheduleService,
		private readonly holidayService: HolidayService,
	) {}

	//FACILITIES
	@Patch('facilities/:facilityID/changeState')
	@ApiOperation({
		summary: 'Update facility state',
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
					state: State.ACTIVE,
				} as UpdateFacilityStateDto,
			},
			INACTIVE: {
				summary: 'INACTIVE',
				value: {
					state: State.INACTIVE,
				} as UpdateFacilityStateDto,
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
	updateFacilityState(
		@Param('facilityID') facilityID: string,
		@Body() data: UpdateFacilityStateDto,
	) {
		console.log(facilityID, data);
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
	getAllAttendancesByFacility(
		@Query() filter: ListOptions<Attendance>,
		@Param('facilityID') facilityID: string,
	) {
		console.log(filter, facilityID);
		//
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
	getAllAttendancesByUser(
		@Query() filter: ListOptions<Attendance>,
		@Param('userID') userID: string,
	) {
		console.log(filter, userID);
		//
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
	deteleAttendance(@Param('attendanceID') attendanceID: string) {
		console.log(attendanceID);
		//
	}

	// CATEGORIES
	@Post('categories')
	@ApiOperation({
		summary: 'Create category',
		description: `Only admin can use this API`,
	})
	@ApiBody({
		type: CreateCategoryDto,
		examples: {
			test: {
				value: {
					type: 'SPA',
					name: 'SPA',
				} as CreateCategoryDto,
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
	async createCategory(@Body() data: CreateCategoryDto) {
		return await this.facilityCategoryService.create(data);
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
	@ApiBody({
		type: UpdateCategoryDto,
		examples: {
			test: {
				value: {
					name: 'string',
				} as UpdateCategoryDto,
			},
		},
	})
	@ApiOkResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				type: 'GYM',
				name: 'GYM',
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
	async updateCategory(
		@Param('categoryID') categoryID: string,
		@Body() data: UpdateCategoryDto,
	) {
		return await this.facilityCategoryService.update(categoryID, data);
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
	deleteCategory(@Param('categoryID') categoryID: string) {
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
										startTime: new Date('7/10/2023 06:00:00'),
										endTime: new Date('7/10/2023 12:00:00'),
									},
									{
										startTime: new Date('7/10/2023 13:00:00'),
										endTime: new Date('7/10/2023 19:00:00'),
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
		console.log(condition);
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
