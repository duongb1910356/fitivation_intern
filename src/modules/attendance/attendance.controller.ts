import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
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
@Controller('attendances')
export class AttendanceController {
	@Public()
	@Get(':attendanceId')
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
	@Roles(UserRole.MEMBER)
	@Get('me')
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
}
