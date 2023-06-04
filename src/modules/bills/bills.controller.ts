import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
} from '@nestjs/common';
import {
	ApiBody,
	ApiOperation,
	ApiResponse,
	ApiTags,
	ApiParam,
	ApiQuery,
} from '@nestjs/swagger';
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { GetBillDto } from './dto/get-bill.dto';
import { ESortField, ESortOrder } from 'src/shared/enum/sort.enum';
import { BillStatus, PaymentMethod } from './schemas/bill.schema';
import { BillItemStatus } from '../bill-items/schemas/bill-item.schema';

@Controller()
export class BillsController {
	constructor(private readonly billsService: BillsService) {}

	@Get('bills')
	@ApiTags('bills')
	@ApiOperation({
		summary: 'getManyBills',
		description: 'Get many bills',
	})
	@ApiQuery({
		name: 'limit',
		required: false,
		type: Number,
	})
	@ApiQuery({
		name: 'offset',
		required: false,
		type: Number,
	})
	@ApiQuery({
		name: 'search',
		required: false,
		type: String,
	})
	@ApiQuery({
		name: 'sortBy',
		required: false,
		type: ESortField.CREATED_AT,
	})
	@ApiQuery({
		name: 'sortOrder',
		required: false,
		type: ESortOrder.ASC,
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: 'id',
						accountID: 'accountID',
						billItems: [
							{
								_id: '_id',
								brandID: 'string',
								facilityID: 'string',
								packageTypeID: 'string',
								packageID: 'string',
								packageName: 'string',
								packageType: 'string',
								packageDescription: 'string',
								brandName: 'string',
								ownerFacilityName: 'string',
								facilityName: 'string',
								facilityAddress: {},
								facilityCoordinatesLocation: [1, 1],
								facilityPhoto: 'string',
								promotions: [{}],
								packagePrice: 1,
								promotionPrice: 1,
								totalPrice: 1,
								status: BillItemStatus.ACTIVE,
								createdAt: Date.now(),
								updatedAt: Date.now(),
							},
						],
						paymenMethod: PaymentMethod.CREDIT_CARD,
						taxes: 0.02,
						description: 'string',
						promotions: [{}],
						promotionPrice: 1,
						totalPrice: 1,
						status: BillStatus.ACTIVE,
						createdAt: Date.now(),
						updatedAt: Date.now(),
					},
				],
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					search: 'string',
					sortBy: ESortField.CREATED_AT,
					sortOrder: ESortOrder.ASC,
				},
			},
		},
	})
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: 403,
				message: `You don't have permission to this access`,
				details: {},
			},
		},
	})
	getManyBills(@Query() filter: GetBillDto) {
		return 'getManyBills';
	}

	@Get('bills/:id')
	@ApiTags('bills')
	@ApiOperation({
		summary: 'getOneBill',
		description: 'Get one bill',
	})
	@ApiParam({ name: 'id', type: String, description: 'Bill ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: 'id',
						accountID: 'accountID',
						billItems: [
							{
								_id: '_id',
								brandID: 'string',
								facilityID: 'string',
								packageTypeID: 'string',
								packageID: 'string',
								packageName: 'string',
								packageType: 'string',
								packageDescription: 'string',
								brandName: 'string',
								ownerFacilityName: 'string',
								facilityName: 'string',
								facilityAddress: {},
								facilityCoordinatesLocation: [1, 1],
								facilityPhoto: 'string',
								promotions: [{}],
								packagePrice: 1,
								promotionPrice: 1,
								totalPrice: 1,
								status: BillItemStatus.ACTIVE,
								createdAt: Date.now(),
								updatedAt: Date.now(),
							},
						],
						paymenMethod: PaymentMethod.CREDIT_CARD,
						taxes: 0.02,
						description: 'string',
						promotions: [{}],
						promotionPrice: 1,
						totalPrice: 1,
						status: BillStatus.ACTIVE,
						createdAt: Date.now(),
						updatedAt: Date.now(),
					},
				],
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					search: 'string',
					sortBy: ESortField.CREATED_AT,
					sortOrder: ESortOrder.ASC,
				},
			},
		},
	})
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: 403,
				message: `You don't have permission to this access`,
				details: {},
			},
		},
	})
	@ApiResponse({
		status: 404,
		schema: {
			example: {
				code: 404,
				message: 'Not found document with that ID',
				details: {},
			},
		},
	})
	getOneBill(@Param('id') id: string) {
		return 'getOneBill';
	}

	@Post('bills')
	@ApiTags('bills')
	@ApiOperation({
		summary: 'createBill',
		description: 'Create one bill',
	})
	@ApiBody({ type: CreateBillDto })
	@ApiResponse({
		status: 201,
		schema: {
			example: {
				message: 'Created successfully',
			},
		},
	})
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: 403,
				message: `You don't have permission to this access`,
				details: {},
			},
		},
	})
	createBill(@Body() createBillDto: CreateBillDto) {
		return 'createBill';
	}

	@Patch('bills/:id')
	@ApiTags('bills')
	@ApiOperation({
		summary: 'updateBill',
		description: 'Update one bill',
	})
	@ApiParam({ name: 'id', type: String, description: 'Bill ID' })
	@ApiBody({ type: UpdateBillDto })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				message: 'Updated successfully',
			},
		},
	})
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: 403,
				message: `You don't have permission to this access`,
				details: {},
			},
		},
	})
	@ApiResponse({
		status: 404,
		schema: {
			example: {
				code: 404,
				message: 'Not found document with that ID',
				details: {},
			},
		},
	})
	updateBill(@Param('id') id: string, @Body() updateBillDto: UpdateBillDto) {
		return 'updateBill';
	}

	@Delete('bills/:id')
	@ApiTags('bills')
	@ApiOperation({
		summary: 'deleteBill',
		description: 'Delete one bill',
	})
	@ApiParam({ name: 'id', type: String, description: 'Bill ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Deleted successfully',
			},
		},
	})
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: 403,
				message: `You don't have permission to this access`,
				details: {},
			},
		},
	})
	@ApiResponse({
		status: 404,
		schema: {
			example: {
				code: 404,
				message: 'Not found document with that ID',
				details: {},
			},
		},
	})
	deleteBill(@Param('id') id: string) {
		return 'deleteBill';
	}

	@Get('bills/me')
	@ApiTags('bills')
	@ApiOperation({
		summary: 'getManyBillsByCustomer',
		description: `Allow users to get many of their bills`,
	})
	@ApiQuery({
		name: 'limit',
		required: false,
		type: Number,
	})
	@ApiQuery({
		name: 'offset',
		required: false,
		type: Number,
	})
	@ApiQuery({
		name: 'search',
		required: false,
		type: String,
	})
	@ApiQuery({
		name: 'sortBy',
		required: false,
		type: ESortField.CREATED_AT,
	})
	@ApiQuery({
		name: 'sortOrder',
		required: false,
		type: ESortOrder.ASC,
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: 'id',
						accountID: 'accountID',
						billItems: [
							{
								_id: '_id',
								brandID: 'string',
								facilityID: 'string',
								packageTypeID: 'string',
								packageID: 'string',
								packageName: 'string',
								packageType: 'string',
								packageDescription: 'string',
								brandName: 'string',
								ownerFacilityName: 'string',
								facilityName: 'string',
								facilityAddress: {},
								facilityCoordinatesLocation: [1, 1],
								facilityPhoto: 'string',
								promotions: [{}],
								packagePrice: 1,
								promotionPrice: 1,
								totalPrice: 1,
								status: BillItemStatus.ACTIVE,
								createdAt: Date.now(),
								updatedAt: Date.now(),
							},
						],
						paymenMethod: PaymentMethod.CREDIT_CARD,
						taxes: 0.02,
						description: 'string',
						promotions: [{}],
						promotionPrice: 1,
						totalPrice: 1,
						status: BillStatus.ACTIVE,
						createdAt: Date.now(),
						updatedAt: Date.now(),
					},
				],
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					search: 'string',
					sortBy: ESortField.CREATED_AT,
					sortOrder: ESortOrder.ASC,
				},
			},
		},
	})
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: 403,
				message: `You don't have permission to this access`,
				details: {},
			},
		},
	})
	getManyBillsByCustomer(@Query() filter: GetBillDto) {
		return 'getManyBillsByCustomer';
	}

	@Get('bills/:id/me')
	@ApiTags('bills')
	@ApiOperation({
		summary: 'getOneBillByCustomer',
		description: `Allow users to get one of their bills`,
	})
	@ApiParam({ name: 'id', type: String, description: 'Bill ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: 'id',
						accountID: 'accountID',
						billItems: [
							{
								_id: '_id',
								brandID: 'string',
								facilityID: 'string',
								packageTypeID: 'string',
								packageID: 'string',
								packageName: 'string',
								packageType: 'string',
								packageDescription: 'string',
								brandName: 'string',
								ownerFacilityName: 'string',
								facilityName: 'string',
								facilityAddress: {},
								facilityCoordinatesLocation: [1, 1],
								facilityPhoto: 'string',
								promotions: [{}],
								packagePrice: 1,
								promotionPrice: 1,
								totalPrice: 1,
								status: BillItemStatus.ACTIVE,
								createdAt: Date.now(),
								updatedAt: Date.now(),
							},
						],
						paymenMethod: PaymentMethod.CREDIT_CARD,
						taxes: 0.02,
						description: 'string',
						promotions: [{}],
						promotionPrice: 1,
						totalPrice: 1,
						status: BillStatus.ACTIVE,
						createdAt: Date.now(),
						updatedAt: Date.now(),
					},
				],
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					search: 'string',
					sortBy: ESortField.CREATED_AT,
					sortOrder: ESortOrder.ASC,
				},
			},
		},
	})
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: 403,
				message: `You don't have permission to this access`,
				details: {},
			},
		},
	})
	@ApiResponse({
		status: 404,
		schema: {
			example: {
				code: 404,
				message: 'Not found document with that ID',
				details: {},
			},
		},
	})
	getOneBillByCustomer(@Param('id') id: string) {
		return 'getOneBillByCustomer';
	}
}
