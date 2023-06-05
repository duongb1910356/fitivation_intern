import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	UseGuards,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
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
import { ErrorResponse } from 'src/shared/response/common-response';
import { Facility } from '../facility/schemas/facility.schema';
import { UserRole } from '../users/schemas/user.schema';
import { Holiday } from './entities/holiday.entity';
import { Public } from '../auth/utils';
import { HolidayDto } from './dto/holiday-dto';

@ApiTags('holidays')
@Controller('holidays')
export class HolidayController {
	@Public()
	@Get(':holidayId')
	@ApiOperation({
		summary: 'Get holiday by holidayId',
		description: `All role can use this API`,
	})
	@ApiParam({ name: 'holidayId', type: String, description: 'Holiday ID' })
	@ApiOkResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				facilityID: {} as unknown as Facility,
				startDate: new Date(),
				endDate: new Date(),
				content: 'string',
				createdAt: new Date(),
				updatedAt: new Date(),
			} as Holiday,
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
	getHoliday(@Param('holidayId') holidayId: string) {
		console.log(holidayId);
		//
	}

	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.FACILITY_OWNER)
	@Patch(':holidayId')
	@ApiOperation({
		summary: 'Update Holiday by holidayId',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({
		name: 'holidayId',
		type: String,
		description: 'Holiday ID',
	})
	@ApiBody({
		type: HolidayDto,
		examples: {
			test: {
				value: {
					startDate: new Date(),
					endDate: new Date(),
					content: 'string',
				} as HolidayDto,
			},
		},
	})
	@ApiOkResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				facilityID: {} as unknown as Facility,
				startDate: new Date(),
				endDate: new Date(),
				content: 'string',
				createdAt: new Date(),
				updatedAt: new Date(),
			} as Holiday,
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
				message: 'Not found Holiday to update!',
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
	updateHoliday(
		@Param('holidayId') holidayId: string,
		@Body() data: HolidayDto,
	) {
		console.log(holidayId, data);
		//
	}

	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.FACILITY_OWNER)
	@Delete(':holidayId')
	@ApiOperation({
		summary: 'Delete Holiday by holidayId',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({
		name: 'holidayId',
		type: String,
		description: 'Holiday ID',
	})
	@ApiOkResponse({
		schema: {
			example: {
				message: 'Delete Holiday successful!',
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
	deleteHoliday(@Param('holidayId') holidayId: string) {
		console.log(holidayId);
		//
	}
}
