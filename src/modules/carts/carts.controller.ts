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
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import {
	ErrorResponse,
	ListOptions,
} from 'src/shared/response/common-response';
import { Cart } from './schemas/cart.schema';
import { ListResponse } from 'src/shared/response/common-response';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import { PurchaseDto } from './dto/purchase-dto';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { PaymentMethod } from '../bills/schemas/bill.schema';

@Controller('carts')
@ApiTags('carts')
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
	// @Roles(UserRole.MEMBER)
	// @UseGuards(RolesGuard)
	getCurrentUserCart(@GetCurrentUser('sub') userID: string): Promise<Cart> {
		return this.cartsService.getCurrent(userID);
	}

	@ApiOperation({
		summary: 'getManyCarts',
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
				options: {
					limit: 1,
					offset: 0,
					searchField: {},
					searchValue: '',
					sortField: 'createdAt',
					sortOrder: 'asc',
				} as ListOptions<Cart>,
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
	getManyCarts(@Query() filter: ListOptions<Cart>) {
		return 'getManyCarts';
	}

	@ApiOperation({
		summary: 'getOneCart',
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
				options: {
					limit: 1,
					offset: 0,
					searchField: {},
					searchValue: '',
					sortField: 'createdAt',
					sortOrder: 'asc',
				} as ListOptions<Cart>,
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
	getOneCart(@Param('id') id: string) {
		return 'getOneCart';
	}

	@ApiOperation({
		summary: 'purchaseInCart',
		description: 'Allow customers to purchase packages in their cart',
	})
	@ApiBody({
		type: PurchaseDto,
		examples: {
			example1: {
				value: {
					paymentOpt: {
						paymentMethod: PaymentMethod.CREDIT_CARD,
						taxes: 0,
						description: 'string',
					},
				},
			},
		},
	})
	@ApiResponse({
		status: 201,
		schema: {
			example: {
				message: 'Purchase successfully',
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
	@Post('purchase')
	// @Roles(UserRole.MEMBER)
	// @UseGuards(RolesGuard)
	purchaseInCart(
		@GetCurrentUser('sub') userID: string,
		@Body() paymentOpt: any,
	) {
		return this.cartsService.purchaseInCart(userID, paymentOpt);
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
	// @Roles(UserRole.MEMBER)
	// @UseGuards(RolesGuard)
	addCartItemToCurrentCart(
		@GetCurrentUser('sub') userID: string,
		@Param('packageID') packageID: string,
	): Promise<boolean> {
		return this.cartsService.addCartItemToCurrentCart(userID, packageID);
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
	// @Roles(UserRole.MEMBER)
	// @UseGuards(RolesGuard)
	removeCartItemToCurrentCart(
		@GetCurrentUser('sub') userID: string,
		@Param('packageID') cartItemID: string,
	): Promise<boolean> {
		return this.cartsService.removeCartItemFromCurrentCart(userID, cartItemID);
	}
}
