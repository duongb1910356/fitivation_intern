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
} from '@nestjs/swagger';
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { Bill, BillStatus, PaymentMethod } from './schemas/bill.schema';
import {
	BillItem,
	BillItemStatus,
} from '../bill-items/schemas/bill-item.schema';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import {
	ErrorResponse,
	ListOptions,
	ListResponse,
} from 'src/shared/response/common-response';

@Controller()
export class BillsController {
	constructor(private readonly billsService: BillsService) {}

	@Get('bills')
	@ApiTags('bills')
	@ApiOperation({
		summary: 'getManyBills',
		description: 'Get many bills',
	})
	@ApiDocsPagination('bill')
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: '_id',
						accountID: {},
						billItems: [
							{
								brandID: {},
								facilityID: {},
								packageTypeID: {},
								packageID: {},
								packageName: 'string',
								packageType: 'string',
								packageDescription: 'string',
								brandName: 'string',
								ownerFacilityName: 'string',
								facilityName: 'string',
								facilityAddress: {},
								facilityCoordinatesLocation: [1, 1],
								facilityPhoto: 'string',
								promotions: [],
								packagePrice: 0,
								promotionPrice: 0,
								totalPrice: 0,
								status: BillItemStatus.ACTIVE,
								createdAt: new Date(),
								updatedAt: new Date(),
							},
						] as BillItem[],
						paymentMethod: PaymentMethod.CREDIT_CARD,
						taxes: 0,
						description: 'string',
						promotions: [],
						promotionPrice: 0,
						totalPrice: 0,
						status: BillStatus.ACTIVE,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				] as Bill[],
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					searchField: {},
					searchValue: '',
					sortField: 'createdAt',
					sortOrder: 'asc',
				} as ListOptions<Bill>,
			} as ListResponse<Bill>,
		},
	})
	@ApiResponse({
		status: 400,
		schema: {
			example: {
				code: '400',
				message: 'Bad request',
				details: null,
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
			},
		},
	})
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: '403',
				message: `Forbidden resource`,
				details: null,
			},
		},
	})
	getManyBills(@Query() filter: ListOptions<Bill>) {
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
						_id: '_id',
						accountID: {},
						billItems: [
							{
								brandID: {},
								facilityID: {},
								packageTypeID: {},
								packageID: {},
								packageName: 'string',
								packageType: 'string',
								packageDescription: 'string',
								brandName: 'string',
								ownerFacilityName: 'string',
								facilityName: 'string',
								facilityAddress: {},
								facilityCoordinatesLocation: [1, 1],
								facilityPhoto: 'string',
								promotions: [],
								packagePrice: 0,
								promotionPrice: 0,
								totalPrice: 0,
								status: BillItemStatus.ACTIVE,
								createdAt: new Date(),
								updatedAt: new Date(),
							},
						] as BillItem[],
						paymentMethod: PaymentMethod.CREDIT_CARD,
						taxes: 0,
						description: 'string',
						promotions: [],
						promotionPrice: 0,
						totalPrice: 0,
						status: BillStatus.ACTIVE,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				] as Bill[],
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					searchField: {},
					searchValue: '',
					sortField: 'createdAt',
					sortOrder: 'asc',
				} as ListOptions<Bill>,
			} as ListResponse<Bill>,
		},
	})
	@ApiResponse({
		status: 400,
		schema: {
			example: {
				code: '400',
				message: 'Bad request',
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
				_id: '_id',
				accountID: {},
				billItems: [
					{
						brandID: {},
						facilityID: {},
						packageTypeID: {},
						packageID: {},
						packageName: 'string',
						packageType: 'string',
						packageDescription: 'string',
						brandName: 'string',
						ownerFacilityName: 'string',
						facilityName: 'string',
						facilityAddress: {},
						facilityCoordinatesLocation: [1, 1],
						facilityPhoto: 'string',
						promotions: [],
						packagePrice: 0,
						promotionPrice: 0,
						totalPrice: 0,
						status: BillItemStatus.ACTIVE,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				] as BillItem[],
				paymentMethod: PaymentMethod.CREDIT_CARD,
				taxes: 0,
				description: 'string',
				promotions: [],
				promotionPrice: 0,
				totalPrice: 0,
				status: BillStatus.ACTIVE,
				createdAt: new Date(),
				updatedAt: new Date(),
			} as Bill,
		},
	})
	@ApiResponse({
		status: 400,
		schema: {
			example: {
				code: '400',
				message: 'Bad request',
				details: null,
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
			},
		},
	})
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: '403',
				message: `Forbidden resource`,
				details: null,
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
		status: 201,
		schema: {
			example: {
				_id: '_id',
				accountID: {},
				billItems: [
					{
						brandID: {},
						facilityID: {},
						packageTypeID: {},
						packageID: {},
						packageName: 'string',
						packageType: 'string',
						packageDescription: 'string',
						brandName: 'string',
						ownerFacilityName: 'string',
						facilityName: 'string',
						facilityAddress: {},
						facilityCoordinatesLocation: [1, 1],
						facilityPhoto: 'string',
						promotions: [],
						packagePrice: 0,
						promotionPrice: 0,
						totalPrice: 0,
						status: BillItemStatus.ACTIVE,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				] as BillItem[],
				paymentMethod: PaymentMethod.CREDIT_CARD,
				taxes: 0,
				description: 'string',
				promotions: [],
				promotionPrice: 0,
				totalPrice: 0,
				status: BillStatus.ACTIVE,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		},
	})
	@ApiResponse({
		status: 400,
		schema: {
			example: {
				code: '400',
				message: 'Bad request',
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
		status: 400,
		schema: {
			example: {
				code: '400',
				message: 'Bad request',
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
	deleteBill(@Param('id') id: string) {
		return 'deleteBill';
	}
}
