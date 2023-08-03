import {
	Controller,
	Get,
	Param,
	ParseIntPipe,
	UseGuards,
} from '@nestjs/common';
import { BillItemsService } from './bill-items.service';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '../users/schemas/user.schema';
import { Roles } from 'src/decorators/role.decorator';
import { RolesGuard } from 'src/guards/role.guard';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { ErrorResponse } from 'src/shared/response/common-response';

@Controller('bill-items')
@ApiTags('bill-items')
@ApiBearerAuth()
export class BillItemsController {
	constructor(private readonly billItemsService: BillItemsService) {}

	@ApiOperation({
		summary: 'Get Quantity bill-item Of Own Facilities Statistic',
		description: `Get quantity bill-item of own facilities.\n\nRoles: ${UserRole.FACILITY_OWNER}.`,
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				data: {
					numberbillItems: 1,
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
	@Get('statics/quantity-facilities')
	@Roles(UserRole.FACILITY_OWNER)
	@UseGuards(RolesGuard)
	async getQuantityBillItemOwnFacilitiesStats(
		@GetCurrentUser('sub') userID: string,
	): Promise<object> {
		return await this.billItemsService.getQuantityBillItemOwnFacilitiesStats(
			userID,
		);
	}

	@ApiOperation({
		summary: 'Get Yearly Bill-items of Own Facilities Statistic',
		description: `Get yearly bills-item of own facilities statistic.\n\nRoles: ${UserRole.FACILITY_OWNER}.`,
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				data: [
					{
						numberBillItems: 7,
						totalPrice: 3940000,
						avgTotalPrice: 562857.1428571428,
						minPrice: 140000,
						maxPrice: 1830000,
						year: 2023,
					},
					{
						numberBillItems: 1,
						totalPrice: 1680000,
						avgTotalPrice: 1680000,
						minPrice: 1680000,
						maxPrice: 1680000,
						year: 2022,
					},
					{
						numberBillItems: 1,
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
	@Get('statics/yearly')
	@Roles(UserRole.FACILITY_OWNER)
	@UseGuards(RolesGuard)
	async getYearlyBillItemOwnFacilitiesStats(
		@GetCurrentUser('sub') userID: string,
	): Promise<Array<object>> {
		return await this.billItemsService.getYearlyBillItemOwnFacilitiesStats(
			userID,
		);
	}

	@ApiOperation({
		summary: 'Get Monthly Bill-items Of Own Facilities Statistic',
		description: `Get monthly bill-items of own facilities statistic.\n\nRoles: ${UserRole.FACILITY_OWNER}.`,
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				data: [
					{
						numberBillItems: 3,
						totalPrice: 2820000,
						avgTotalPrice: 940000,
						minPrice: 150000,
						maxPrice: 1830000,
						month: 3,
					},
					{
						numberBillItems: 1,
						totalPrice: 420000,
						avgTotalPrice: 420000,
						minPrice: 420000,
						maxPrice: 420000,
						month: 2,
					},
					{
						numberBillItems: 3,
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
	@Get('statics/monthly/:year')
	@Roles(UserRole.FACILITY_OWNER)
	@UseGuards(RolesGuard)
	async getMonthlyBillItemOwnFacilitiesStats(
		@Param('year', ParseIntPipe) year: number,
		@GetCurrentUser('sub') userID: string,
	): Promise<Array<object>> {
		return await this.billItemsService.getMonthlyBillItemOwnFacilitiesStats(
			year,
			userID,
		);
	}
}
