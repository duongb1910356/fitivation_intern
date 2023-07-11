import {
	Controller,
	Get,
	Post,
	Param,
	Query,
	UseGuards,
	Body,
	Patch,
	Delete,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { ErrorResponse } from 'src/shared/response/common-response';
import { Cart } from './schemas/cart.schema';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import { PaymentOptDto } from '../payments/dto/payment-options-dto';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Bill, BillStatus, PaymentMethod } from '../bills/schemas/bill.schema';
import { ListResponse, QueryObject } from 'src/shared/utils/query-api';
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
import { BillItemFacility } from '../bill-items/schemas/bill-item-facility.schema';
import { TimeType } from '../package/entities/package.entity';

@Controller('carts')
@ApiTags('carts')
@ApiBearerAuth()
export class CartsController {
	constructor(private readonly cartsService: CartsService) {}
	@ApiOperation({
		summary: 'getCurrentUserCart',
		description: 'Get logged user cart',
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				_id: '_id',
				accountID: 'string',
				cartItemIDs: [],
				promotionIDs: [],
				promotionPrice: 0,
				totalPrice: 0,
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
				message: 'Bad request',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@Get('me')
	@Roles(UserRole.MEMBER)
	@UseGuards(RolesGuard)
	async getCurrentUserCart(
		@GetCurrentUser('sub') userID: string,
	): Promise<Cart> {
		return await this.cartsService.getCurrent(userID, {
			path: 'cartItemIDs',
			model: 'CartItem',
			populate: {
				path: 'packageID',
				model: 'Package',
				populate: {
					path: 'packageTypeID',
					model: 'PackageType',
					populate: {
						path: 'facilityID',
						model: 'Facility',
						select: '-reviews',
					},
				},
			},
		});
	}

	@ApiOperation({
		summary: 'findManyCarts',
		description: 'Get many carts',
	})
	@ApiDocsPagination('cart')
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: '_id',
						accountID: 'string',
						cartItemIDs: [],
						promotionIDs: [],
						promotionPrice: 0,
						totalPrice: 0,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				] as Cart[],
				total: 1,
				queryOptions: {
					sort: 'string',
					fields: 'string',
					limit: 10,
					page: 0,
				} as QueryObject,
			} as ListResponse<Cart>,
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
	@Get()
	@Roles(UserRole.ADMIN)
	@UseGuards(RolesGuard)
	async findManyCarts(
		@Query() query: QueryObject,
	): Promise<ListResponse<Cart>> {
		return await this.cartsService.findMany(query);
	}

	@ApiOperation({
		summary: 'findOneCart',
		description: 'Get one cart',
	})
	@ApiParam({ name: 'id', type: String, description: 'Cart ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: '_id',
						accountID: 'string',
						cartItemIDs: [],
						promotionIDs: [],
						promotionPrice: 0,
						totalPrice: 0,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				] as Cart[],
				total: 1,
				queryOptions: {
					sort: 'string',
					fields: 'string',
					limit: 10,
					page: 0,
				} as QueryObject,
			} as ListResponse<Cart>,
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
	@Get(':id')
	@Roles(UserRole.ADMIN)
	@UseGuards(RolesGuard)
	async findOneCart(@Param('id') id: string) {
		return await this.cartsService.findOneByID(id);
	}

	@ApiOperation({
		summary: 'addCartItemToCurrentCart',
		description: 'Add Cart-item to current Cart',
	})
	@ApiParam({ name: 'packageID', type: String, description: 'Pacakge ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: true,
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
	@Patch('cart-items/:packageID')
	@Roles(UserRole.MEMBER)
	@UseGuards(RolesGuard)
	async addCartItemToCurrentCart(
		@GetCurrentUser('sub') userID: string,
		@Param('packageID') packageID: string,
	): Promise<boolean> {
		return await this.cartsService.addCartItemToCurrentCart(userID, packageID);
	}

	@ApiOperation({
		summary: 'removeCartItemToCurrentCart',
		description: 'Remove cart-item to current Cart',
	})
	@ApiParam({ name: 'pacakgeID', type: String, description: 'Pacakge ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: true,
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
	@Delete('cart-items/:packageID')
	@Roles(UserRole.MEMBER)
	@UseGuards(RolesGuard)
	async removeCartItemToCurrentCart(
		@GetCurrentUser('sub') userID: string,
		@Param('packageID') cartItemID: string,
	): Promise<boolean> {
		return await this.cartsService.removeCartItemFromCurrentCart(
			userID,
			cartItemID,
		);
	}

	// @Patch('cart-items/:cartItemID/promotions/:promotionID')
	// // @Roles(UserRole.ADMIN, UserRole.MEMBER)
	// // @UseGuards(RolesGuard)
	// addPackagePromotionToCartItem(
	// 	@GetCurrentUser('sub') userID: string,
	// 	@Param('cartItemID') cartItemID: string,
	// 	@Param('promotionID') promotionID: string,
	// ): Promise<boolean> {
	// 	return this.cartsService.addPackagePromotionToCartItemInCurrentCart(
	// 		userID,
	// 		cartItemID,
	// 		promotionID,
	// 	);
	// }

	// @Delete('cart-items/:cartItemID/promotions/:promotionID')
	// // @Roles(UserRole.ADMIN, UserRole.MEMBER)
	// // @UseGuards(RolesGuard)
	// removePackagePromotionToCartItem(
	// 	@GetCurrentUser('sub') userID: string,
	// 	@Param('cartItemID') cartItemID: string,
	// 	@Param('promotionID') promotionID: string,
	// ) {
	// 	//
	// }
}
