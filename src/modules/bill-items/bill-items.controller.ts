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
import { BillItemsService } from './bill-items.service';
import { CreateBillItemDto } from './dto/create-bill-item.dto';
import { UpdateBillItemDto } from './dto/update-bill-item.dto';
import {
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { ESortField, ESortOrder } from 'src/shared/enum/sort.enum';
import { BillItem, BillItemStatus } from './schemas/bill-item.schema';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';

@Controller()
export class BillItemsController {
	constructor(private readonly billItemsService: BillItemsService) {}

	@Get('bill-items')
	@ApiTags('bill-items')
	@ApiOperation({
		summary: 'getManyBillItems',
		description: 'Get many bill-items',
	})
	@ApiDocsPagination('bill-item')
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: '_id',
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
						packagePrice: 1,
						promotionPrice: 1,
						totalPrice: 1,
						status: BillItemStatus.ACTIVE,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				] as BillItem[],
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					searchField: {},
					searchValue: '',
					sortField: 'createdAt',
					sortOrder: 'asc',
				} as ListOptions<BillItem>,
			} as ListResponse<BillItem>,
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
	getManyBillItems(@Query() filter: ListOptions<BillItem>) {
		return 'getManyBillItems';
	}
	@Get('bill-items/:id')
	@ApiTags('bill-items')
	@ApiOperation({
		summary: 'getOneBillItem',
		description: 'Get one bill-item',
	})
	@ApiParam({ name: 'id', type: String, description: 'Bill-item ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: '_id',
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
						packagePrice: 1,
						promotionPrice: 1,
						totalPrice: 1,
						status: BillItemStatus.ACTIVE,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				] as BillItem[],
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					searchField: {},
					searchValue: '',
					sortField: 'createdAt',
					sortOrder: 'asc',
				} as ListOptions<BillItem>,
			} as ListResponse<BillItem>,
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
	getOneBillItems(@Param('id') id: string) {
		return 'getOneBillItems';
	}
	@Post('bill-items')
	@ApiTags('bill-items')
	@ApiOperation({
		summary: 'createBillItem',
		description: 'Create one bill-item',
	})
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
	createBillItem(@Body() createBillItemDto: CreateBillItemDto) {
		return 'createBillItem';
	}
	@Patch('bill-items/:id')
	@ApiTags('bill-items')
	@ApiOperation({
		summary: 'updateBillItem',
		description: 'Update one bill-item',
	})
	@ApiParam({ name: 'id', type: String, description: 'Bill-item ID' })
	@ApiBody({ type: UpdateBillItemDto })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				message: 'Updated successfully',
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
	updateBillItem(
		@Param('id') id: string,
		@Body() updateBillItemDto: UpdateBillItemDto,
	) {
		return 'updateBillItem';
	}
	@Delete('bill-items/:id')
	@ApiTags('bill-items')
	@ApiOperation({
		summary: 'deleteBillItem',
		description: 'Delete one bill-item',
	})
	@ApiParam({ name: 'id', type: String, description: 'Bill-item ID' })
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
		status: 404,
		schema: {
			example: {
				code: 404,
				message: 'Not found document with that ID',
				details: {},
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
	deleteBillItem(@Param('id') id: string) {
		return 'deleteBillItem';
	}

	@Get('bills/:billID/bill-items')
	@ApiTags('bills/bill-items')
	@ApiOperation({
		summary: 'getBillItemsForBill',
		description: 'Get all bill-items for specific bill',
	})
	@ApiParam({ name: 'billID', type: String, description: 'Bill ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: '_id',
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
						packagePrice: 1,
						promotionPrice: 1,
						totalPrice: 1,
						status: BillItemStatus.ACTIVE,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				] as BillItem[],
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					searchField: {},
					searchValue: '',
					sortField: 'createdAt',
					sortOrder: 'asc',
				} as ListOptions<BillItem>,
			} as ListResponse<BillItem>,
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
	getBillItemsForBill(@Param('billID') billID: string) {
		return 'getBillItemsForBill';
	}

	@Post('bills/:billID/bill-items')
	@ApiTags('bills/bill-items')
	@ApiOperation({
		summary: 'createBillItemForBill',
		description: 'Create one bill-item for specific bIll',
	})
	@ApiParam({ name: 'billID', type: String, description: 'Bill ID' })
	@ApiResponse({
		status: 201,
		schema: {
			example: {
				message: 'Created successfully',
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
	createBillItemForBill(@Param('billID') billID: string) {
		return 'createBillItemForBill';
	}

	@Get('facilities/bill-items')
	@ApiTags('facilities/bill-items')
	@ApiOperation({
		summary: 'getManyBillItemsAllOwnFacility',
		description:
			'Allow facility owners to get many bill-items for all owned facilities',
	})
	@ApiDocsPagination('bill-item')
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: '_id',
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
						packagePrice: 1,
						promotionPrice: 1,
						totalPrice: 1,
						status: BillItemStatus.ACTIVE,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				] as BillItem[],
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					searchField: {},
					searchValue: '',
					sortField: 'createdAt',
					sortOrder: 'asc',
				} as ListOptions<BillItem>,
			} as ListResponse<BillItem>,
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
	getManyBillItemsAllOwnFacility(@Query() filter: ListOptions<BillItem>) {
		return 'getManyBillItemsAllOwnFacility';
	}
	@Get('facilities/:facilityID/bill-items')
	@ApiParam({ name: 'facilityID', type: String, description: 'facility ID' })
	@ApiTags('facilities/bill-items')
	@ApiOperation({
		summary: 'getManyBillItemsOneOwnFacility',
		description:
			'Allow facility owners to get many bill-items for one owned facility\n\nAllow admin to get many bill-items for one facility',
	})
	@ApiDocsPagination('bill-item')
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: '_id',
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
						packagePrice: 1,
						promotionPrice: 1,
						totalPrice: 1,
						status: BillItemStatus.ACTIVE,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				] as BillItem[],
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					searchField: {},
					searchValue: '',
					sortField: 'createdAt',
					sortOrder: 'asc',
				} as ListOptions<BillItem>,
			} as ListResponse<BillItem>,
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
	getManyBillItemsOneOwnFacility(
		@Param('facilityID') facilityID: string,
		@Query() filter: ListOptions<BillItem>,
	) {
		return 'getManyBillItemsOneOwnFacility';
	}
	@Get('facilities/:facilityID/bill-items/:billItemID')
	@ApiTags('facilities/bill-items')
	@ApiOperation({
		summary: 'getOneBillItemOneOwnFacility',
		description:
			'Allow facility owners to get one bill-item for one owned facility\n\nAllow admin to get one bill-item for one facility',
	})
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiParam({ name: 'billItemID', type: String, description: 'Bill-item ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: '_id',
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
						packagePrice: 1,
						promotionPrice: 1,
						totalPrice: 1,
						status: BillItemStatus.ACTIVE,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				] as BillItem[],
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					searchField: {},
					searchValue: '',
					sortField: 'createdAt',
					sortOrder: 'asc',
				} as ListOptions<BillItem>,
			} as ListResponse<BillItem>,
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
	getOneBillItemOneOwnFacility(
		@Param('facilityID') facilityID: string,
		@Param('billItemID') billItemID: string,
	) {
		return 'getOneBillItemOneOwnFacility';
	}
	@Get('package/bill-items')
	@ApiTags('packages/bill-items')
	@ApiOperation({
		summary: 'getManyBillItemsAllOwnPackage',
		description:
			'Allow facility owners to get many bill-items for all owned package',
	})
	@ApiDocsPagination('bill-item')
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: '_id',
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
						packagePrice: 1,
						promotionPrice: 1,
						totalPrice: 1,
						status: BillItemStatus.ACTIVE,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				] as BillItem[],
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					searchField: {},
					searchValue: '',
					sortField: 'createdAt',
					sortOrder: 'asc',
				} as ListOptions<BillItem>,
			} as ListResponse<BillItem>,
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
	getManyBillItemsAllOwnPackage(@Query() filter: ListOptions<BillItem>) {
		return 'getManyBillItemsAllOwnPackage';
	}
	@Get('package/:packageID/bill-items')
	@ApiTags('packages/bill-items')
	@ApiOperation({
		summary: 'getManyBillItemsOneOwnPackage',
		description:
			'Allow facility owners to get many bill-items for one owned package\n\nAllow admin to get many bill-items for one package',
	})
	@ApiParam({ name: 'packageID', type: String, description: 'Package ID' })
	@ApiDocsPagination('bill-item')
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: '_id',
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
						packagePrice: 1,
						promotionPrice: 1,
						totalPrice: 1,
						status: BillItemStatus.ACTIVE,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				] as BillItem[],
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					searchField: {},
					searchValue: '',
					sortField: 'createdAt',
					sortOrder: 'asc',
				} as ListOptions<BillItem>,
			} as ListResponse<BillItem>,
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
	getManyBillItemsOneOwnPackage(
		@Param('packageID') packageID: string,
		@Query() filter: ListOptions<BillItem>,
	) {
		return 'getManyBillItemsOneOwnPackage';
	}
	@Get('package/:packageID/bill-items/:billItemID')
	@ApiTags('packages/bill-items')
	@ApiOperation({
		summary: 'getOneBillItemOneOwnPackage',
		description:
			'Allow facility owners to get one bill-item for one owned package\n\nAllow admin to get one bill-item for one package',
	})
	@ApiParam({ name: 'packageID', type: String, description: 'Package ID' })
	@ApiParam({ name: 'billItemID', type: String, description: 'Bill-item ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: '_id',
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
						packagePrice: 1,
						promotionPrice: 1,
						totalPrice: 1,
						status: BillItemStatus.ACTIVE,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				] as BillItem[],
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					searchField: {},
					searchValue: '',
					sortField: 'createdAt',
					sortOrder: 'asc',
				} as ListOptions<BillItem>,
			} as ListResponse<BillItem>,
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
	getOneBillItemOneOwnPackage(
		@Param('packageID') packageID: string,
		@Param('billItemID') billItemID: string,
	) {
		return 'getOneBillItemOneOwnPackage';
	}
	@Get('brands/bill-items')
	@ApiTags('brands/bill-items')
	@ApiOperation({
		summary: 'getManyBillItemsAllOwnBrand',
		description:
			'Allow facility owners to get many bill-items for all owned brand',
	})
	@ApiDocsPagination('bill-item')
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: '_id',
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
						packagePrice: 1,
						promotionPrice: 1,
						totalPrice: 1,
						status: BillItemStatus.ACTIVE,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				] as BillItem[],
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					searchField: {},
					searchValue: '',
					sortField: 'createdAt',
					sortOrder: 'asc',
				} as ListOptions<BillItem>,
			} as ListResponse<BillItem>,
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
	getManyBillItemsAllOwnBrand(@Query() filter: ListOptions<BillItem>) {
		return 'getManyBillItemsAllOwnBrand';
	}
	@Get('brands/:brandID/bill-items')
	@ApiTags('brands/bill-items')
	@ApiOperation({
		summary: 'getManyBillItemsOneOwnBrand',
		description:
			'Allow facility owners to get many billItems for one owned brand\n\nAllow admin to get many bill-items for one brand',
	})
	@ApiParam({ name: 'brandID', type: String, description: 'Brand ID' })
	@ApiDocsPagination('bill-item')
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: '_id',
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
						packagePrice: 1,
						promotionPrice: 1,
						totalPrice: 1,
						status: BillItemStatus.ACTIVE,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				] as BillItem[],
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					searchField: {},
					searchValue: '',
					sortField: 'createdAt',
					sortOrder: 'asc',
				} as ListOptions<BillItem>,
			} as ListResponse<BillItem>,
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
	getManyBillItemsOneOwnBrand(
		@Param('brandID') brandID: string,
		@Query() filter: ListOptions<BillItem>,
	) {
		return 'getManyBillItemsOneOwnBrand';
	}
	@Get('brands/:brandID/bill-items/:billItemID')
	@ApiTags('brands/bill-items')
	@ApiOperation({
		summary: 'getOneBillItemOneOwnBrand',
		description:
			'Allow facility owners to get one bill-items for one owned brand\n\nAllow admin to get one bill-item for one brand',
	})
	@ApiParam({ name: 'brandID', type: String, description: 'Brand ID' })
	@ApiParam({ name: 'billItemID', type: String, description: 'Bill-item ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: '_id',
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
						packagePrice: 1,
						promotionPrice: 1,
						totalPrice: 1,
						status: BillItemStatus.ACTIVE,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				] as BillItem[],
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					searchField: {},
					searchValue: '',
					sortField: 'createdAt',
					sortOrder: 'asc',
				} as ListOptions<BillItem>,
			} as ListResponse<BillItem>,
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
	getOneBillItemOneOwnBrand(
		@Param('brandID') brandID: string,
		@Param('billItemID') billItemID: string,
	) {
		return 'getOneBillItemOneOwnBrand';
	}
}
