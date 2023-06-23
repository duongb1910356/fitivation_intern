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
import { ErrorResponse } from 'src/shared/response/common-response';
import { Facility } from '../facility/schemas/facility.schema';
import { Holiday } from './entities/holiday.entity';
import { HolidayDto } from './dto/holiday-dto';
import { OwnershipHolidayGuard } from 'src/guards/ownership/ownership-holiday.guard';
import { HolidayService } from './holiday.service';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('holidays')
@Controller('holidays')
export class HolidayController {
	constructor(private readonly holidayService: HolidayService) {}

	@Public()
	@Get(':holidayID')
	@ApiOperation({
		summary: 'Get holiday by holidayID',
		description: `All role can use this API`,
	})
	@ApiParam({ name: 'holidayID', type: String, description: 'Holiday ID' })
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
	async getHoliday(@Param('holidayID') holidayID: string) {
		return await this.holidayService.findOneByID(holidayID, 'facilityID');
	}

	@ApiBearerAuth()
	@UseGuards(OwnershipHolidayGuard)
	@Patch(':holidayID')
	@ApiOperation({
		summary: 'Update Holiday by holidayID',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({
		name: 'holidayID',
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
	async updateHoliday(
		@Param('holidayID') holidayID: string,
		@Body() data: HolidayDto,
	) {
		return await this.holidayService.update(holidayID, data);
	}

	@ApiBearerAuth()
	@UseGuards(OwnershipHolidayGuard)
	@Delete(':holidayID')
	@ApiOperation({
		summary: 'Delete Holiday by holidayID',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({
		name: 'holidayID',
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
	async deleteHoliday(@Param('holidayID') holidayID: string) {
		return await this.holidayService.delete(holidayID);
	}
}
