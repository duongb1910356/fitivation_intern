import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import {
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import {
	ErrorResponse,
	ListOptions,
	ListResponse,
} from 'src/shared/response/common-response';
import { CartItem } from './schemas/cart-item.schema';
import { CreateCartItemDto } from './dto/create-cart-item-dto';
import { UpdateCartItemDto } from './dto/update-cart-item-dto';

@Controller('cart-items')
@ApiTags('cart-items')
export class CartItemsController {
	@Get()
	@ApiDocsPagination('cart-item')
	@ApiOperation({
		summary: 'getManyCartItems',
		description: 'Get many cart-items',
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						packageID: {},
						promotionIDs: [],
						promotionPrice: 0,
						totalPrice: 0,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				] as CartItem[],
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					searchField: {},
					searchValue: '',
					sortField: 'createdAt',
					sortOrder: 'asc',
				} as ListOptions<CartItem>,
			} as ListResponse<CartItem>,
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
	getManyCartItems(@Query() filter: ListOptions<CartItem>) {
		return 'getManyCartItems';
	}
	@Get(':id')
	@ApiOperation({ summary: 'getOneCartItem', description: 'Get one cart-item' })
	@ApiParam({ name: 'cartID', type: String, description: 'Cart ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						packageID: {},
						promotionIDs: [],
						promotionPrice: 0,
						totalPrice: 0,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				] as CartItem[],
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					searchField: {},
					searchValue: '',
					sortField: 'createdAt',
					sortOrder: 'asc',
				} as ListOptions<CartItem>,
			} as ListResponse<CartItem>,
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
	getOneCartItem(@Param('id') id: string) {
		return 'getOneCartItem';
	}
	@Post()
	@ApiOperation({
		summary: 'createCartItem',
		description: 'Create one cart-item',
	})
	@ApiBody({
		type: CreateCartItemDto,
		examples: {
			example1: {
				value: {
					packageID: 'string',
					promotionIDs: [],
				},
			},
		},
	})
	@ApiResponse({
		status: 201,
		schema: {
			example: {
				packageID: {},
				promotionIDs: [],
				promotionPrice: 0,
				totalPrice: 0,
				createdAt: new Date(),
				updatedAt: new Date(),
			} as CartItem,
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
	createCartItem(@Body() createCartItemDto: CreateCartItemDto) {
		return 'createCartItem';
	}
	@Patch(':id')
	@ApiOperation({
		summary: 'updateCartItem',
		description: 'Update one cart-item',
	})
	@ApiParam({ name: 'cartID', type: String, description: 'Cart ID' })
	@ApiBody({
		type: UpdateCartItemDto,
		examples: {
			example1: {
				value: {
					packageID: 'string',
					promotionIDs: [],
				},
			},
		},
	})
	@ApiResponse({
		status: 201,
		schema: {
			example: {
				packageID: {},
				promotionIDs: [],
				promotionPrice: 0,
				totalPrice: 0,
				createdAt: new Date(),
				updatedAt: new Date(),
			} as CartItem,
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
	updateCartItem(
		@Param('id') id: string,
		@Body() updateCartItemDto: UpdateCartItemDto,
	) {
		return 'updateCartItem';
	}
	@Delete(':id')
	@ApiOperation({
		summary: 'deleteCartItem',
		description: 'Delete one cart-item',
	})
	@ApiParam({ name: 'cartID', type: String, description: 'Cart ID' })
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
	deleteCartItem(@Param('id') id: string) {
		return 'deleteCartItem';
	}

	@Patch(':cartItemID/promotions/:promotionID')
	addPackagePromotionToCartItem() {}

	@Delete(':cartItemID/promotions/:promotionID')
	removePackagePromotionToCartItem() {}
}
