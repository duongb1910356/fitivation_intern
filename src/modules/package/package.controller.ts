import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { Public } from '../auth/utils';
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
import { Roles } from 'src/decorators/role.decorator';
import { PackageType } from '../package-type/entities/package-type.entity';
import { Facility } from '../facility/schemas/facility.schema';
import {
	ErrorResponse,
	ListOptions,
	ListResponse,
} from 'src/shared/response/common-response';
import { UserRole } from '../users/schemas/user.schema';
import { RolesGuard } from 'src/guards/role.guard';
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
import { CreatePromotionDto } from '../promotions/dto/create-promotion.dto';
import { UpdatePromotionDto } from '../promotions/dto/update-promotion.dto';

@ApiTags('packages')
@Controller('packages')
export class PackageController {
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
	getPackage(@Param('packageID') packageID: string) {
		console.log(packageID);
		//
	}

	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.FACILITY_OWNER)
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
					price: 540000,
				} as UpdatePackageDto,
			},
			Test2: {
				value: {
					price: 90000,
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
	updatePackage(
		@Param('packageID') packageID: string,
		@Body() data: UpdatePackageDto,
	) {
		console.log(packageID, data);
		//
	}

	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.FACILITY_OWNER)
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
	deletePackage(@Param('packageID') packageID: string) {
		console.log(packageID);
		//
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
						facilityInfo: {
							brandName: 'string',
							ownerFacilityName: 'string',
							facilityName: 'string',
							facilityAddress: {},
							facilityCoordinatesLocation: [1, 1],
							facilityPhoto: 'string',
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
						facilityInfo: {
							brandName: 'string',
							ownerFacilityName: 'string',
							facilityName: 'string',
							facilityAddress: {},
							facilityCoordinatesLocation: [1, 1],
							facilityPhoto: 'string',
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

	@Get('packages/promotions')
	@ApiDocsPagination('promotion')
	@ApiTags('packages/promotions')
	@ApiOperation({
		summary: 'getManyPackagePromotionsOfAllOwnPackages',
		description:
			'Allow facility owner to get many packages promotions of all own packages',
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						targetID: 'string',
						type: PromotionType.PACKAGE,
						name: 'string',
						description: 'string',
						couponCode: 'string',
						value: 1,
						method: PromotionMethod.NUMBER,
						minPriceApply: 0,
						maxQuantity: 0,
						startDate: new Date(),
						endDate: new Date(),
						customerType: CustomerType.CUSTOMER,
						status: PromotionStatus.ACTIVE,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				] as Promotion[],
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					searchField: {},
					searchValue: '',
					sortField: 'createdAt',
					sortOrder: 'asc',
				} as ListOptions<Promotion>,
			} as ListResponse<Promotion>,
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
	getManyPackagePromotionsOfAllOwnPackages(
		@Query() filter: ListOptions<Promotion>,
	) {
		console.log(filter);
		return 'getManyPackagePromotionsOfAllOwnPackages';
	}

	@Get('packages/:packagesID/promotions')
	@ApiDocsPagination('promotion')
	@ApiTags('packages/promotions')
	@ApiOperation({
		summary: 'getManyPackagesPromotionsOfOnePackage',
		description:
			'Allow facility owner to get many package promotions of one own package\n\nAllow customer/admin to get many package promotions of one facility',
	})
	@ApiParam({ name: 'packagesID', type: String, description: 'Facility ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						targetID: 'string',
						type: PromotionType.PACKAGE,
						name: 'string',
						description: 'string',
						couponCode: 'string',
						value: 1,
						method: PromotionMethod.NUMBER,
						minPriceApply: 0,
						maxQuantity: 0,
						startDate: new Date(),
						endDate: new Date(),
						customerType: CustomerType.CUSTOMER,
						status: PromotionStatus.ACTIVE,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				] as Promotion[],
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					searchField: {},
					searchValue: '',
					sortField: 'createdAt',
					sortOrder: 'asc',
				} as ListOptions<Promotion>,
			} as ListResponse<Promotion>,
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
	getManyPackagesPromotionsOfOnePackage(
		@Param('packagesID') packagesID: string,
		@Query() filter: ListOptions<Promotion>,
	) {
		console.log(filter);
		return 'getManyPackagesPromotionsOfOnePackage';
	}

	@Get('packages/:packagesID/promotions/:promotionID')
	@ApiTags('packages/promotions')
	@ApiOperation({
		summary: 'getOnePackagePromotionOfOnePackage',
		description:
			'Allow facility owner to get one package promotion of one own package\n\nAllow customer/admin to get one package promotion of one facility',
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						targetID: 'string',
						type: PromotionType.PACKAGE,
						name: 'string',
						description: 'string',
						couponCode: 'string',
						value: 1,
						method: PromotionMethod.NUMBER,
						minPriceApply: 0,
						maxQuantity: 0,
						startDate: new Date(),
						endDate: new Date(),
						customerType: CustomerType.CUSTOMER,
						status: PromotionStatus.ACTIVE,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				] as Promotion[],
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					searchField: {},
					searchValue: '',
					sortField: 'createdAt',
					sortOrder: 'asc',
				} as ListOptions<Promotion>,
			} as ListResponse<Promotion>,
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
	@ApiParam({ name: 'packagesID', type: String, description: 'Facility ID' })
	@ApiParam({ name: 'promotionID', type: String, description: 'Promotion ID' })
	getOnePackagePromotionOfOnePackage(
		@Param('packagesID') packagesID: string,
		@Param('promotionID') promotionID: string,
	) {
		console.log(packagesID, promotionID);
		return 'getOnePackagePromotionOfOnePackage';
	}
	@Post('packages/:packagesID/promotions')
	@ApiTags('packages/promotions')
	@ApiOperation({
		summary: 'createPackagePromotion',
		description:
			'Allow facility owner to create one package promotions of one own package',
	})
	@ApiParam({ name: 'packagesID', type: String, description: 'Facility ID' })
	@ApiBody({
		type: CreatePromotionDto,
		examples: {
			ADMIN: {
				value: {
					targetID: 'string',
					type: PromotionType.PACKAGE,
					name: 'string',
					description: 'string',
					couponCode: 'string',
					value: 1,
					method: PromotionMethod.NUMBER,
					minPriceApply: 0,
					maxQuantity: 0,
					startDate: new Date(),
					endDate: new Date(),
					customerType: CustomerType.CUSTOMER,
				},
			},
		},
	})
	@ApiResponse({
		status: 201,
		schema: {
			example: {
				targetID: 'string',
				type: PromotionType.PACKAGE,
				name: 'string',
				description: 'string',
				couponCode: 'string',
				value: 1,
				method: PromotionMethod.NUMBER,
				minPriceApply: 0,
				maxQuantity: 0,
				startDate: new Date(),
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
	createPackagePromotion() {
		return 'createPackagePromotion';
	}
	@Patch('packages/:packagesID/promotions/:promotionID')
	@ApiTags('packages/promotions')
	@ApiOperation({
		summary: 'updatePackagePromotion',
		description:
			'Allow facility owner to update one package promotion of one own package',
	})
	@ApiParam({ name: 'packagesID', type: String, description: 'Facility ID' })
	@ApiParam({ name: 'promotionID', type: String, description: 'Promotion ID' })
	@ApiBody({
		type: CreatePromotionDto,
		examples: {
			ADMIN: {
				value: {
					targetID: 'string',
					type: PromotionType.PACKAGE,
					name: 'string',
					description: 'string',
					couponCode: 'string',
					value: 1,
					method: PromotionMethod.NUMBER,
					minPriceApply: 0,
					maxQuantity: 0,
					startDate: new Date(),
					endDate: new Date(),
					customerType: CustomerType.CUSTOMER,
				},
			},
		},
	})
	@ApiResponse({
		status: 201,
		schema: {
			example: {
				targetID: 'string',
				type: PromotionType.PACKAGE,
				name: 'string',
				description: 'string',
				couponCode: 'string',
				value: 1,
				method: PromotionMethod.NUMBER,
				minPriceApply: 0,
				maxQuantity: 0,
				startDate: new Date(),
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
	updatePackagePromotion(
		@Param('packagesID') packagesID: string,
		@Param('promotionID') promotionID: string,
		@Body() updatePromotionDto: UpdatePromotionDto,
	) {
		console.log(packagesID, promotionID, updatePromotionDto);
		return 'updatePackagePromotion';
	}
	@Delete('packages/:packagesID/promotions/:promotionID')
	@ApiTags('packages/promotions')
	@ApiParam({ name: 'packagesID', type: String, description: 'Facility ID' })
	@ApiParam({ name: 'promotionID', type: String, description: 'Promotion ID' })
	@ApiOperation({
		summary: 'deletePackagePromotion',
		description:
			'Allow facility owner to delete one package promotion of one own package',
	})
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
	deletePackegPromotion(
		@Param('packageID') packageID: string,
		@Param('promotionID') promotionID: string,
	) {
		console.log(packageID, promotionID);
		return 'deletePackagePromotion';
	}
}
