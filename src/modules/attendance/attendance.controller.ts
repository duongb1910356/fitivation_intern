import { Controller, Get, Param } from '@nestjs/common';
import {
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import { ErrorResponse } from 'src/shared/response/common-response';
import { User } from '../users/schemas/user.schema';
import { Attendance } from './entities/attendance.entity';
import { Facility } from '../facility/schemas/facility.schema';
import { Public } from '../auth/utils';
import { AttendanceService } from './attendance.service';

@ApiTags('attendances')
@Controller('attendances')
export class AttendanceController {
	constructor(private readonly attendanceService: AttendanceService) {}

	@Public()
	@Get(':attendanceID')
	@ApiOperation({
		summary: 'Get Attendance by attendanceID',
		description: `All role can use this API`,
	})
	@ApiParam({
		name: 'attendanceID',
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
	async getAttendance(@Param('attendanceID') attendanceID: string) {
		return await this.attendanceService.findOneByCondition({
			_id: attendanceID,
		});
	}
}
