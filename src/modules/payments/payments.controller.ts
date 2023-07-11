import {
	Body,
	Controller,
	Param,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { RolesGuard } from 'src/guards/role.guard';
import { PaymentOptDto } from './dto/payment-options-dto';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { Bill, BillStatus, PaymentMethod } from '../bills/schemas/bill.schema';
import { ErrorResponse } from 'src/shared/response/common-response';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import {
	CustomerType,
	Promotion,
	PromotionMethod,
	PromotionStatus,
	PromotionType,
} from '../promotions/schemas/promotion.schema';
import {
	BillItem,
	BillItemStatus,
} from '../bill-items/schemas/bill-item.schema';
import { BillItemPackage } from '../bill-items/schemas/bill-item-package.schema';
import { BillItemPackageType } from '../bill-items/schemas/bill-item-package-type.schema';
import { TimeType } from '../package/entities/package.entity';
import { BillItemFacility } from '../bill-items/schemas/bill-item-facility.schema';
import { PaymentsService } from './payments.service';
import { TokenPayload } from '../auth/types/token-payload.type';
import {
	Subscription,
	SubscriptionStatus,
} from '../subscriptions/schemas/subscription.schema';
import { PaymentOptWithCartItemIDsDto } from './dto/payment-option-with-cartItemID-dto';

@Controller('payments')
export class PaymentsController {
	constructor(private readonly paymentService: PaymentsService) {}

	@ApiOperation({
		summary: 'purchaseAllInCart',
		description: 'Allow customers to purchase All cart-item in their cart',
	})
	// @ApiBody({
	// 	type: PaymentOptDto,
	// 	examples: {
	// 		example1: {
	// 			value: {
	// 				paymentOpt: {
	// 					paymentMethod: PaymentMethod.CREDIT_CARD,
	// 					taxes: 0,
	// 					description: 'string',
	// 				},
	// 			},
	// 		},
	// 	},
	// })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				_id: '_id',
				accountID: 'string',
				billItems: [
					{
						_id: '_id',
						brandID: 'string',
						facilityID: 'string',
						packageTypeID: 'string',
						packageID: 'string',
						ownerFacilityID: 'string',
						facilityInfo: {
							brandName: 'string',
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
								targetID: 'string',
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
				paymentMethod: PaymentMethod.CREDIT_CARD,
				taxes: 0,
				description: 'string',
				promotions: [
					{
						targetID: {},
						type: PromotionType.FACILITY,
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
					{
						targetID: {},
						type: PromotionType.BILL,
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
				],
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
		status: 402,
		schema: {
			example: {
				code: '402',
				message: 'Payment Required',
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
	@Post('purchase-all')
	@Roles(UserRole.MEMBER)
	@UseGuards(RolesGuard)
	async purchaseAllInCart(
		@GetCurrentUser('sub') userID: string,
		@Body() paymentOpt: PaymentOptDto,
	): Promise<Bill> {
		return await this.paymentService.purchaseAllInCart(userID, paymentOpt);
	}

	@ApiOperation({
		summary: 'purchaseAllInCart',
		description: 'Allow customers to purchase All cart-item in their cart',
	})
	// @ApiBody({
	// 	type: PaymentOptDto,
	// 	examples: {
	// 		example1: {
	// 			value: {
	// 				paymentOpt: {
	// 					paymentMethod: PaymentMethod.CREDIT_CARD,
	// 					taxes: 0,
	// 					description: 'string',
	// 				},
	// 			},
	// 		},
	// 	},
	// })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				_id: '_id',
				accountID: 'string',
				billItems: [
					{
						_id: '_id',
						brandID: 'string',
						facilityID: 'string',
						packageTypeID: 'string',
						packageID: 'string',
						ownerFacilityID: 'string',
						facilityInfo: {
							brandName: 'string',
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
								targetID: 'string',
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
				paymentMethod: PaymentMethod.CREDIT_CARD,
				taxes: 0,
				description: 'string',
				promotions: [
					{
						targetID: {},
						type: PromotionType.FACILITY,
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
					{
						targetID: {},
						type: PromotionType.BILL,
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
				],
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
		status: 402,
		schema: {
			example: {
				code: '402',
				message: 'Payment Required',
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
	@Post('purchase-some')
	@Roles(UserRole.MEMBER)
	@UseGuards(RolesGuard)
	async purchaseSomeInCart(
		@GetCurrentUser('sub') userID: string,
		@Body() paymentOptWithCartItemIDsDto: PaymentOptWithCartItemIDsDto,
	): Promise<any> {
		return await this.paymentService.purchaseSomeInCart(
			userID,
			paymentOptWithCartItemIDsDto,
		);
	}

	@ApiOperation({
		summary: 'renew',
		description: 'Allow customer to extend package when package was expired',
	})
	@ApiParam({ name: 'id', type: String, description: 'Subscription ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				accountID: 'string',
				billItemID: 'string',
				packageID: 'string',
				facilityID: 'string',
				expires: new Date(),
				status: SubscriptionStatus.ACTIVE,
				renew: true,
			} as Subscription,
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
		status: 402,
		schema: {
			example: {
				code: '402',
				message: 'Payment Required',
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
	@Patch('renew/:id')
	@Roles(UserRole.MEMBER)
	@UseGuards(RolesGuard)
	async renew(
		@GetCurrentUser() user: TokenPayload,
		@Param('id') id: string,
		@Body() paymentOpt: PaymentOptDto,
	): Promise<Subscription> {
		return await this.paymentService.renew(id, user, paymentOpt);
	}

	// purchaseAllInCartItem() {}
	// purchaseSomeInCartItem() {}
}
