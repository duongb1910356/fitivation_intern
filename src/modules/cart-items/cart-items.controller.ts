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
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('cart-items')
export class CartItemsController {
	@Get('cart-items')
	@ApiTags('cart-items')
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
						cartID: {},
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
	@Get('cart-items/:id')
	@ApiTags('cart-items')
	@ApiOperation({ summary: 'getOneCartItem', description: 'Get one cart-item' })
	@ApiParam({ name: 'cartID', type: String, description: 'Cart ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						cartID: {},
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
	@Post('cart-items')
	@ApiTags('cart-items')
	@ApiOperation({
		summary: 'createCartItem',
		description: 'Create one cart-item',
	})
	@ApiBody({ type: CreateCartItemDto })
	@ApiResponse({
		status: 201,
		schema: {
			example: {
				cartID: {},
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
	@Patch('cart-items/:id')
	@ApiTags('cart-items')
	@ApiOperation({
		summary: 'updateCartItem',
		description: 'Update one cart-item',
	})
	@ApiParam({ name: 'cartID', type: String, description: 'Cart ID' })
	@ApiBody({ type: UpdateCartItemDto })
	@ApiResponse({
		status: 201,
		schema: {
			example: {
				cartID: {},
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
	@Delete('cart-items/:id')
	@ApiTags('cart-items')
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
	@Post('carts/:cartID/cart-items')
	@ApiTags('cart-items')
	@ApiOperation({
		summary: 'createCartItemForCart',
		description: 'Create cart-item for specific cart',
	})
	@ApiParam({ name: 'cartID', type: String, description: 'Cart ID' })
	@ApiBody({ type: CreateCartItemDto })
	@ApiResponse({
		status: 201,
		schema: {
			example: {
				cartID: {},
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
	createCartItemForCart(
		@Param('cartID') cartID: string,
		@Body() createCartItemDto: CreateCartItemDto,
	) {
		return 'createCartItemForCart';
	}
	@Patch('carts/:cartID/cart-items/:cartItemID')
	@ApiTags('cart-items')
	@ApiOperation({
		summary: 'updateCartItemForCart',
		description: 'Update cart-item for specific cart',
	})
	@ApiParam({ name: 'cartID', type: String, description: 'Cart ID' })
	@ApiParam({ name: 'cartItemID', type: String, description: 'Cart-Item ID' })
	@ApiBody({ type: UpdateCartItemDto })
	@ApiResponse({
		status: 201,
		schema: {
			example: {
				cartID: {},
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
	updateCartItemForCart(
		@Param('cartID') cartID: string,
		@Param('cartItemID') cartItemID: string,
		@Body() updateCartItemDto: UpdateCartItemDto,
	) {
		return 'updateCartItemForCart';
	}
	@Delete('carts/:cartID/cart-items/:cart-itemID')
	@ApiTags('cart-items')
	@ApiOperation({
		summary: 'deleteCartItemForCart',
		description: 'Delete cart-item for specific cart',
	})
	@ApiParam({ name: 'cartID', type: String, description: 'Cart ID' })
	@ApiParam({ name: 'cartItemID', type: String, description: 'Cart-item ID' })
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
	deleteCartItemForCart(
		@Param('cartID') cartID: string,
		@Param('cartItemID') cartItemID: string,
	) {
		return 'deleteCartItemForCart';
	}
}
