import {
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	Request,
	UseGuards,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/role-decorator/role.decorator';
import { RolesGuard } from 'src/decorators/role-decorator/role.guard';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import {
	ListOptions,
	ListResponse,
	ErrorResponse,
} from 'src/shared/response/common-response';
import { User, UserRole } from '../users/schemas/user.schema';
import { Attendance } from './entities/attendance.entity';
import { Facility } from '../facility/schemas/facility.schema';
import RequestWithUser from 'src/interfaces/requestWithUser.interface';
import { Public } from '../auth/utils';

@ApiTags('attendances')
@Controller()
export class AttendanceController {
	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN)
	@Get('attendances')
	@ApiOperation({
		summary: 'Get All Attendances',
		description: `Only admin can use this API`,
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
	getAllAttendances(@Query() filter: ListOptions<Attendance>) {
		console.log(filter);
		//
	}

	@Public()
	@Get('attendances/:attendanceId')
	@ApiOperation({
		summary: 'Get Attendance by attendanceId',
		description: `All role can use this API`,
	})
	@ApiParam({
		name: 'attendanceId',
		type: String,
		description: 'Attendance ID',
	})
	@ApiOkResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				facilityID: {} as unknown as Facility,
				accountID: {} as unknown as User,
				date: [],
				createdAt: new Date(),
				updatedAt: new Date(),
			} as Attendance,
		},
	})
	@ApiNotFoundResponse({
		schema: {
			example: {
				code: '404',
				message: 'Attendance not found!',
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
	getAttendance(@Param('attendanceId') attendanceId: string) {
		console.log(attendanceId);
		//
	}

	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN, UserRole.FACILITY_OWNER)
	@Get('facilities/:facilityId/attendances')
	@ApiOperation({
		summary: 'Get All Attendance by facilityId',
		description: `Owner can use this API`,
	})
	@ApiParam({
		name: 'facilityId',
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
	@ApiNotFoundResponse({
		schema: {
			example: {
				code: '404',
				message: 'Facility not found!',
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
		@Param('facilityId') facilityId: string,
		@Query() filter: ListOptions<Attendance>,
	) {
		console.log(facilityId, filter);
		//
	}

	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN, UserRole.MEMBER)
	@Get('/api/attendances/me')
	@ApiOperation({
		summary: 'Get All Attendance by User',
		description: `Member can use this API`,
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
					sortField: 'facilityID',
					sortOrder: 'asc',
				} as ListOptions<Attendance>,
			} as ListResponse<Attendance>,
		},
	})
	@ApiNotFoundResponse({
		schema: {
			example: {
				code: '404',
				message: 'Facility not found!',
				details: null,
			} as ErrorResponse<null>,
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
	getAllAttendancesByUser(@Request() req: RequestWithUser) {
		const userId = req.user._id;
		console.log(userId);
		//
	}

	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN, UserRole.MEMBER)
	@Post('facilities/:facilityId/attendances')
	@ApiOperation({
		summary: 'Create new Attendance',
		description: `Member can use this API, 
        Create new Attendance by facilityId end userId (get to req)`,
	})
	@ApiParam({
		name: 'facilityId',
		type: String,
		description: 'Facility ID',
	})
	@ApiCreatedResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				facilityID: {} as unknown as Facility,
				accountID: {} as unknown as User,
				date: [],
				createdAt: new Date(),
				updatedAt: new Date(),
			} as Attendance,
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
	createAttendance(
		@Request() req: RequestWithUser,
		@Param('facilityId') FacilitylityId: string,
	) {
		const userId = req.user._id;
		console.log(userId, FacilitylityId);
		//
	}

	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN, UserRole.MEMBER)
	@Patch('attendances/:attendanceId')
	@ApiOperation({
		summary: 'Update Attendance by attendanceId',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({
		name: 'attendanceId',
		type: String,
		description: 'Attendance ID',
	})
	@ApiOkResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				facilityID: {} as unknown as Facility,
				accountID: {} as unknown as User,
				date: [new Date(2023, 5, 3, 18), new Date(2023, 5, 4, 18, 3)],
				createdAt: new Date(),
				updatedAt: new Date(),
			} as Attendance,
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
				message: 'Not found Attendance to update!',
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
	updateAttendance(
		@Request() req: any,
		@Param('attendanceId') attendanceId: string,
	) {
		const currentDate = req.timestamp;
		const userid = req.user._id;
		console.log(attendanceId, userid, currentDate);
		//Logic: thuc chat chi la cong them ngay goi api vao update
	}

	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN)
	@Delete('attendances/:attendanceId')
	@ApiOperation({
		summary: 'Delete Attendance by attendanceId',
		description: `Only Admin can use this API`,
	})
	@ApiParam({
		name: 'attendanceId',
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
	deteleAttendance(@Param('attendanceId') attendanceId: string) {
		console.log(attendanceId);
		//
	}
}
