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

@Controller('')
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
						billItems: [{}],
						paymenMethod: PaymentMethod.CREDIT_CARD,
						taxes: 0.02,
						description: 'string',
						promotions: [{}],
						promotionPrice: 1000,
						totalPrice: 1000,
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
				message: `You don't have permisstion to this access`,
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
						billItems: [{}],
						paymenMethod: PaymentMethod.CREDIT_CARD,
						taxes: 0.02,
						description: 'string',
						promotions: [{}],
						promotionPrice: 1000,
						totalPrice: 1000,
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
				message: `You don't have permisstion to this access`,
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
				data: {},
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
				data: {},
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
						billItems: [{}],
						paymenMethod: PaymentMethod.CREDIT_CARD,
						taxes: 0.02,
						description: 'string',
						promotions: [{}],
						promotionPrice: 1000,
						totalPrice: 1000,
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
				message: `You don't have permisstion to this access`,
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
						billItems: [{}],
						paymenMethod: PaymentMethod.CREDIT_CARD,
						taxes: 0.02,
						description: 'string',
						promotions: [{}],
						promotionPrice: 1000,
						totalPrice: 1000,
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
				message: `You don't have permisstion to this access`,
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

	@Get('/facilities/bills')
	@ApiTags('facilities/bills')
	@ApiOperation({
		summary: 'getManyBillsAllOwnFacility',
		description:
			'Allow facility owners to get many bills for all owned facilities',
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
						billItems: [{}],
						paymenMethod: PaymentMethod.CREDIT_CARD,
						taxes: 0.02,
						description: 'string',
						promotions: [{}],
						promotionPrice: 1000,
						totalPrice: 1000,
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
				message: `You don't have permisstion to this access`,
				details: {},
			},
		},
	})
	getManyBillsAllOwnFacility(@Query() filter: GetBillDto) {
		return 'getManyBillsAllOwnFacility';
	}

	@Get('/facilities/:facilityID/bills')
	@ApiTags('facilities/bills')
	@ApiOperation({
		summary: 'getManyBillsOneOwnFacility',
		description: `Allow facility owners to get many bills for one owned facility`,
	})
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
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
						billItems: [{}],
						paymenMethod: PaymentMethod.CREDIT_CARD,
						taxes: 0.02,
						description: 'string',
						promotions: [{}],
						promotionPrice: 1000,
						totalPrice: 1000,
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
				message: `You don't have permisstion to this access`,
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
	getManyBillsOneOwnFacility(
		@Query() filter: GetBillDto,
		@Param('facilityID') facilityID: string,
	) {
		return 'getManyBillsOneOwnFacility';
	}

	@Get('/facilities/:facilityID/bills/:billID')
	@ApiTags('facilities/bills')
	@ApiOperation({
		summary: 'getOneBillOneOwnFacility',
		description: 'Allow facility owners to get one bill for one owned facility',
	})
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiParam({ name: 'billID', type: String, description: 'Bill ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: 'id',
						accountID: 'accountID',
						billItems: [{}],
						paymenMethod: PaymentMethod.CREDIT_CARD,
						taxes: 0.02,
						description: 'string',
						promotions: [{}],
						promotionPrice: 1000,
						totalPrice: 1000,
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
				message: `You don't have permisstion to this access`,
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
	getOneBillOneOwnFacility(
		@Param('facilityID') facilityID: string,
		@Param('billID') billID: string,
	) {
		return 'getOneBillOneOwnFacility';
	}

	@Get('/packages/bills')
	@ApiTags('packages/bills')
	@ApiOperation({
		summary: 'getManyBillsAllOwnPackage',
		description:
			'Allow facility owners to get many bills for all owned package',
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
						billItems: [{}],
						paymenMethod: PaymentMethod.CREDIT_CARD,
						taxes: 0.02,
						description: 'string',
						promotions: [{}],
						promotionPrice: 1000,
						totalPrice: 1000,
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
				message: `You don't have permisstion to this access`,
				details: {},
			},
		},
	})
	getManyBillsAllOwnPackage(@Query() filter: GetBillDto) {
		return 'getManyBillsAllOwnPackage';
	}

	@Get('/packages/:packageID/bills')
	@ApiTags('packages/bills')
	@ApiOperation({
		summary: 'getManyBillsOneOwnPackage',
		description: `Allow facility owners to get many bills for one owned package`,
	})
	@ApiParam({ name: 'packageID', type: String, description: 'Package ID' })
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
						billItems: [{}],
						paymenMethod: PaymentMethod.CREDIT_CARD,
						taxes: 0.02,
						description: 'string',
						promotions: [{}],
						promotionPrice: 1000,
						totalPrice: 1000,
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
				message: `You don't have permisstion to this access`,
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
	getManyBillsOneOwnPackage(
		@Query() filter: GetBillDto,
		@Param('packageID') packageID: string,
	) {
		return 'getManyBillsOneOwnPackage';
	}

	@Get('/packages/:packageID/bills/:billID')
	@ApiTags('packages/bills')
	@ApiOperation({
		summary: 'getOneBillOneOwnPackage',
		description: 'Allow facility owners to get one bill for one owned package',
	})
	@ApiParam({ name: 'packageID', type: String, description: 'Package ID' })
	@ApiParam({ name: 'billID', type: String, description: 'Bill ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: 'id',
						accountID: 'accountID',
						billItems: [{}],
						paymenMethod: PaymentMethod.CREDIT_CARD,
						taxes: 0.02,
						description: 'string',
						promotions: [{}],
						promotionPrice: 1000,
						totalPrice: 1000,
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
				message: `You don't have permisstion to this access`,
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
	getOneBillOneOwnPackage(
		@Param('packageID') packageID: string,
		@Param('billID') billID: string,
	) {
		return 'getOneBillOneOwnPackage';
	}

	@Get('/brands/bills')
	@ApiTags('brands/bills')
	@ApiOperation({
		summary: 'getManyBillsAllOwnBrand',
		description: 'Allow facility owners to get many bills for all owned brand',
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
						billItems: [{}],
						paymenMethod: PaymentMethod.CREDIT_CARD,
						taxes: 0.02,
						description: 'string',
						promotions: [{}],
						promotionPrice: 1000,
						totalPrice: 1000,
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
				message: `You don't have permisstion to this access`,
				details: {},
			},
		},
	})
	getManyBillsAllOwnBrand(@Query() filter: GetBillDto) {
		return 'getManyBillsAllOwnBrand';
	}

	@Get('/brands/:brandID/bills')
	@ApiTags('brands/bills')
	@ApiOperation({
		summary: 'getManyBillsOneOwnBrand',
		description: `Allow facility owners to get many bills for one owned brand`,
	})
	@ApiParam({ name: 'brandID', type: String, description: 'Brand ID' })
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
						billItems: [{}],
						paymenMethod: PaymentMethod.CREDIT_CARD,
						taxes: 0.02,
						description: 'string',
						promotions: [{}],
						promotionPrice: 1000,
						totalPrice: 1000,
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
				message: `You don't have permisstion to this access`,
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
	getManyBillsOneOwnBrand(
		@Query() filter: GetBillDto,
		@Param('brandID') brandID: string,
	) {
		return 'getManyBillsOneOwnBrand';
	}

	@Get('/brands/:brandID/bills/:billID')
	@ApiTags('brands/bills')
	@ApiOperation({
		summary: 'getOneBillOneOwnBrand',
		description: 'Allow facility owners to get one bill for one owned brand',
	})
	@ApiParam({ name: 'brandID', type: String, description: 'Brand ID' })
	@ApiParam({ name: 'billID', type: String, description: 'Bill ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: 'id',
						accountID: 'accountID',
						billItems: [{}],
						paymenMethod: PaymentMethod.CREDIT_CARD,
						taxes: 0.02,
						description: 'string',
						promotions: [{}],
						promotionPrice: 1000,
						totalPrice: 1000,
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
				message: `You don't have permisstion to this access`,
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
	getOneBillOneOwnBrand(
		@Param('brandID') brandID: string,
		@Param('billID') billID: string,
	) {
		return 'getOneBillOneOwnBrand';
	}
}
