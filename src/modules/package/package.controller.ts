import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	Req,
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
	ApiResponse,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Package, TimeType } from './entities/package.entity';
import { UpdatePackageDto } from './dto/update-package-dto';
import { PackageType } from '../package-type/entities/package-type.entity';
import { Facility } from '../facility/schemas/facility.schema';
import {
	ErrorResponse,
	ListOptions,
	ListResponse,
} from 'src/shared/response/common-response';
import {
	BillItem,
	BillItemStatus,
} from '../bill-items/schemas/bill-item.schema';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import { BillItemFacility } from '../bill-items/schemas/bill-item-facility.schema';
import { BillItemPackageType } from '../bill-items/schemas/bill-item-package-type.schema';
import { BillItemPackage } from '../bill-items/schemas/bill-item-package.schema';
import {
	PromotionType,
	PromotionMethod,
	CustomerType,
	PromotionStatus,
	Promotion,
} from '../promotions/schemas/promotion.schema';
import { CreatePromotionDto } from '../promotions/dto/create-promotion-dto';
import { OwnershipPackageGuard } from 'src/guards/ownership/ownership-package.guard';
import { PackageService } from './package.service';
import { Public } from '../auth/decorators/public.decorator';
import { MongoIdValidationPipe } from 'src/pipes/parseMongoId.pipe';
import { UpdatePromotionDto } from '../promotions/dto/update-promotion-dto';

@ApiTags('packages')
@Controller('packages')
export class PackageController {
	constructor(private readonly packageService: PackageService) {}

	@Public()
	@Get(':packageID')
	@ApiOperation({
		summary: 'Get Package by packageID',
		description: `All role can use this API`,
	})
	@ApiParam({ name: 'packageID', type: String, description: 'Package ID' })
	@ApiOkResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				packageTypeID: {} as unknown as PackageType,
				facilityID: {} as unknown as Facility,
				type: TimeType.ONE_MONTH,
				price: 100000,
				benefits: ['Use of bathroom', 'Use of massage chair'],
				createdAt: new Date(),
				updatedAt: new Date(),
			} as Package,
		},
	})
	@ApiNotFoundResponse({
		schema: {
			example: {
				code: '404',
				message: 'PackageType not found!',
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
	async getPackage(
		@Param('packageID', MongoIdValidationPipe) packageID: string,
	) {
		return await this.packageService.findOneByID(
			packageID,
			'packageTypeID facilityID',
		);
	}

	@ApiBearerAuth()
	@UseGuards(OwnershipPackageGuard)
	@Patch(':packageID')
	@ApiOperation({
		summary: 'Update Package by packageID',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({
		name: 'packageID',
		type: String,
		description: 'Package ID',
	})
	@ApiBody({
		type: UpdatePackageDto,
		examples: {
			Test1: {
				value: {
					price: 90000,
					benefits: ['Use of bathroom', 'Use of massage chair'],
				} as UpdatePackageDto,
			},
			Test2: {
				value: {
					price: 540000,
					benefits: [
						'Unlimited access',
						'Use of bathroom',
						'Use of massage chair',
					],
				} as UpdatePackageDto,
			},
		},
	})
	@ApiOkResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				packageTypeID: {} as unknown as PackageType,
				facilityID: {} as unknown as Facility,
				type: TimeType.ONE_MONTH,
				price: 90000,
				benefits: ['Use of bathroom', 'Use of massage chair'],
				createdAt: new Date(),
				updatedAt: new Date(),
			} as Package,
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
				message: 'Not found Package to update!',
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
	async updatePackage(
		@Param('packageID', MongoIdValidationPipe) packageID: string,
		@Body() data: UpdatePackageDto,
	) {
		return await this.packageService.update(packageID, data);
	}

	@ApiBearerAuth()
	@UseGuards(OwnershipPackageGuard)
	@Delete(':packageID')
	@ApiOperation({
		summary: 'Delete Package by packageID',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({
		name: 'packageID',
		type: String,
		description: 'Package ID',
	})
	@ApiOkResponse({
		schema: {
			example: {
				message: 'Delete Package successful!',
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
				message: 'Package not found!',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	async deletePackage(
		@Param('packageID', MongoIdValidationPipe) packageID: string,
	) {
		return await this.packageService.delete(packageID);
	}

	@Get(':packageID/bill-items')
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
						facilityInfo: {
							brandName: 'string',
							facilityName: 'string',
							facilityAddress: {},
							facilityCoordinatesLocation: {
								coordinates: [10.027851057940572, 105.77291088739058],
							},
							facilityPhotos: [],
						} as BillItemFacility,
						packageTypeInfo: {
							name: 'string',
							description: 'string',
							price: 1,
						} as BillItemPackageType,
						packageInfo: {
							type: TimeType.ONE_MONTH,
							price: 1,
						} as BillItemPackage,
						promotions: [
							{
								targetID: {},
								type: PromotionType.PACKAGE,
								name: 'string',
								description: 'string',
								couponCode: 'string',
								value: 1,
								method: PromotionMethod.NUMBER,
								minPriceApply: 1,
								maxValue: 1,
								maxQuantity: 1,
								startDate: new Date(),
								endDate: new Date(),
								customerType: CustomerType.CUSTOMER,
								status: PromotionStatus.ACTIVE,
								createdAt: new Date(),
								updatedAt: new Date(),
							},
						] as Promotion[],
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
	getManyBillItemsOneOwnPackage(
		@Param('packageID') packageID: string,
		@Query() filter: ListOptions<BillItem>,
	) {
		console.log(packageID, filter);
		return 'getManyBillItemsOneOwnPackage';
	}

	@Get(':packageID/bill-items/:billItemID')
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
						facilityInfo: {
							brandName: 'string',
							facilityName: 'string',
							facilityAddress: {},
							facilityCoordinatesLocation: {
								coordinates: [10.027851057940572, 105.77291088739058],
							},
							facilityPhotos: [],
						} as BillItemFacility,
						packageTypeInfo: {
							name: 'string',
							description: 'string',
							price: 1,
						} as BillItemPackageType,
						packageInfo: {
							type: TimeType.ONE_MONTH,
							price: 1,
						} as BillItemPackage,
						promotions: [
							{
								targetID: {},
								type: PromotionType.PACKAGE,
								name: 'string',
								description: 'string',
								couponCode: 'string',
								value: 1,
								method: PromotionMethod.NUMBER,
								minPriceApply: 1,
								maxValue: 1,
								maxQuantity: 1,
								startDate: new Date(),
								endDate: new Date(),
								customerType: CustomerType.CUSTOMER,
								status: PromotionStatus.ACTIVE,
								createdAt: new Date(),
								updatedAt: new Date(),
							},
						] as Promotion[],
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
	getOneBillItemOneOwnPackage(
		@Param('packageID') packageID: string,
		@Param('billItemID') billItemID: string,
	) {
		console.log(packageID, billItemID);
		return 'getOneBillItemOneOwnPackage';
	}

	@ApiBearerAuth()
	@UseGuards(OwnershipPackageGuard)
	@Post(':packageID/promotions')
	@ApiOperation({
		summary: 'Create package promotion',
	})
	@ApiBearerAuth()
	@ApiParam({ name: 'packageID', type: String, description: 'packageID' })
	@ApiBody({
		type: CreatePromotionDto,
		examples: {
			test1: {
				value: {
					name: 'Mừng hè đi tập gym nè',
					description: 'Chính sách mô tả',
					couponCode: '066',
					value: 10,
					method: 'PERCENT',
					minPriceApply: 0,
					maxValue: 10000,
					maxQuantity: 45,
					startDate: new Date(),
					endDate: new Date(),
					customerType: 'MEMBER',
					status: 'ACTIVE',
				} as CreatePromotionDto,
			},
		},
	})
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					_id: 'string',
					targetID: '6498f23e20d189a6b1607c7e',
					type: PromotionType.PACKAGE,
					name: 'Mừng hè đi tập gym nè',
					description: 'Chính sách mô tả',
					couponCode: '066',
					value: 10,
					method: 'PERCENT',
					minPriceApply: 0,
					maxValue: 10000,
					maxQuantity: 45,
					startDate: new Date(),
					endDate: new Date(),
					customerType: 'MEMBER',
					status: 'ACTIVE',
					createdAt: new Date(),
					updatedAt: new Date(),
				} as Promotion,
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	createPromotion(
		@Param('packageID') packageID: string,
		@Body() body: CreatePromotionDto,
	) {
		return this.packageService.createPromotion(packageID, body);
	}

	@Public()
	@Get(':packageID/promotions')
	@ApiParam({ name: 'packageID', type: String, description: 'packageID' })
	@ApiOperation({
		summary: 'Get many package promotion',
	})
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					_id: 'string',
					targetID: '6498f23e20d189a6b1607c7e',
					type: 'FACILITY',
					name: 'Mừng hè đi tập gym nè',
					description: 'Chính sách mô tả',
					couponCode: '066',
					value: 10,
					method: 'PERCENT',
					minPriceApply: 0,
					maxValue: 10000,
					maxQuantity: 45,
					startDate: new Date(),
					endDate: new Date(),
					customerType: 'MEMBER',
					status: 'ACTIVE',
					createdAt: new Date(),
					updatedAt: new Date(),
				} as Promotion,
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	findManyPromotion(@Param('packageID') packageID) {
		return this.packageService.findManyPromotion(packageID);
	}

	@ApiBearerAuth()
	@Patch('promotion/:promotionID')
	@ApiOperation({
		summary: 'update Package Promotion',
		description: 'Allow facility owner to update package promotion',
	})
	@ApiParam({ name: 'promotionID', type: String, description: 'Promotion ID' })
	@ApiBody({
		type: UpdatePromotionDto,
		examples: {
			Test1: {
				value: {
					name: 'string',
					description: 'string',
					couponCode: 'string',
					value: 1,
					method: PromotionMethod.NUMBER,
					minPriceApply: 1,
					maxValue: 1,
					maxQuantity: 1,
					endDate: new Date(),
					customerType: CustomerType.CUSTOMER,
					status: PromotionStatus.ACTIVE,
				} as UpdatePromotionDto,
			},
		},
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				targetID: {},
				type: PromotionType.PACKAGE,
				name: 'string',
				description: 'string',
				couponCode: 'string',
				value: 1,
				method: PromotionMethod.NUMBER,
				minPriceApply: 1,
				maxValue: 1,
				maxQuantity: 1,
				endDate: new Date(),
				customerType: CustomerType.CUSTOMER,
				status: PromotionStatus.ACTIVE,
				createdAt: new Date(),
				updatedAt: new Date(),
			} as Promotion,
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
	async updatePromotion(
		@Param('promotionID') promotionID: string,
		@Body() body: UpdatePromotionDto,
		@Req() req: any,
	) {
		return await this.packageService.updatePromotion(promotionID, body, req);
	}

	@ApiBearerAuth()
	@Delete('promotion/:promotionID')
	@ApiOperation({
		summary: 'delete package Promotion',
		description: 'Allow facility owner to delete package promotion',
	})
	@ApiParam({ name: 'promotionID', type: String, description: 'Promotion ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				code: '200',
				message: 'Deleted successfully',
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
	deletePromotion(@Param('promotionID') promotionID: string, @Req() req: any) {
		return this.packageService.deletePromotion(promotionID, req);
	}
}
