import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Res,
	UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { RolesGuard } from 'src/guards/role.guard';
import { CartPaymentRequestDto } from './dto/cart-payment-request-dto';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { Bill, BillStatus } from '../bills/schemas/bill.schema';
import { ErrorResponse } from 'src/shared/response/common-response';
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
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
import { PaymentMethodDto } from './dto/payment-method-dto';
import { Response } from 'express';
import { SubscriptionPaymentRequestDto } from './dto/subscription-payment-request-dto';
import { PaymentResponse } from './types/payment-response.type';

@Controller('payments/v1')
@ApiTags('payments')
@ApiBearerAuth()
export class PaymentsController {
	constructor(private readonly paymentService: PaymentsService) {}

	@ApiOperation({
		summary: 'Create Cart Payment',
		description: `Allow customers to purchase cart-item in their cart.\n\nRoles: ${UserRole.MEMBER}`,
	})
	@ApiBody({
		type: CartPaymentRequestDto,
		examples: {
			example1: {
				value: {
					description: 'string (option)',
					cartItemIDs: ['string', 'string'],
				} as CartPaymentRequestDto,
			},
		},
	})
	@ApiResponse({
		status: 201,
		schema: {
			example: {
				message: 'string',
				clientSecret: 'string',
				paymentIntentID: 'string',
			} as PaymentResponse,
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
	@Post('cart-payment')
	@Roles(UserRole.MEMBER)
	@UseGuards(RolesGuard)
	@HttpCode(HttpStatus.CREATED)
	async createCartPayment(
		@Body() cartPaymentRequestDto: CartPaymentRequestDto,
		@GetCurrentUser('sub') userID: string,
	): Promise<PaymentResponse> {
		return await this.paymentService.createCartPayment(
			cartPaymentRequestDto,
			userID,
		);
	}

	@ApiOperation({
		summary: 'Create Subscription Payment',
		description: `Allow customers to purchase to renew their subscription.\n\nRoles: ${UserRole.MEMBER}`,
	})
	@ApiBody({
		type: SubscriptionPaymentRequestDto,
		examples: {
			example1: {
				value: {
					description: 'string (option)',
					subscriptionID: 'string',
				} as SubscriptionPaymentRequestDto,
			},
		},
	})
	@ApiResponse({
		status: 201,
		schema: {
			example: {
				message: 'string',
				clientSecret: 'string',
				paymentIntentID: 'string',
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
	@Post('subscription-payment')
	@Roles(UserRole.MEMBER)
	@UseGuards(RolesGuard)
	@HttpCode(HttpStatus.CREATED)
	async createSubscriptionPayment(
		@GetCurrentUser() userPayload: TokenPayload,
		@Body() subscriptionRequestDto: SubscriptionPaymentRequestDto,
	): Promise<PaymentResponse> {
		return await this.paymentService.createSubscriptionPayment(
			userPayload,
			subscriptionRequestDto,
		);
	}

	@ApiOperation({
		summary: 'Confirm Payment',
		description: `Allow customers to confirm a purchase.\n\nRoles: ${UserRole.MEMBER}.`,
	})
	@ApiBody({
		type: CartPaymentRequestDto,
		examples: {
			example1: {
				value: {
					paymentMethod: 'string',
				} as PaymentMethodDto,
			},
		},
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				message: 'string',
				clientSecret: 'string',
				paymentIntentID: 'string',
				bill: {
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
					paymentMethod: 'string',
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
			} as PaymentResponse,
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
	@Post('confirm/:paymentIntentID')
	@Roles(UserRole.MEMBER)
	@UseGuards(RolesGuard)
	async confirmPayment(
		@Param('paymentIntentID') paymentIntentID: string,
		@Body() paymentMethod: PaymentMethodDto,
		@GetCurrentUser() userPayload: TokenPayload,
		@Res() response: Response,
	): Promise<void> {
		return await this.paymentService.confirmPayment(
			paymentIntentID,
			paymentMethod,
			userPayload,
			response,
		);
	}
}
