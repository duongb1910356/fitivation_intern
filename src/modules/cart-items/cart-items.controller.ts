import {
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import { ListOptions } from 'src/shared/response/common-response';
import { CartItem } from './schemas/cart-item.schema';

@Controller('cart-items')
export class CartItemsController {
	@Get('cart-items')
	@ApiDocsPagination('cart-item')
	@ApiTags('cart-items')
	@ApiOperation({ summary: 'getManyCartItems' })
	getManyCartItems(@Query() filter: ListOptions<CartItem>) {
		return 'getManyCartItems';
	}
	@Get('cart-items/:id')
	@ApiTags('cart-items')
	@ApiOperation({ summary: 'getOneCartItem' })
	@ApiParam({ name: 'cartID', type: String, description: 'Cart ID' })
	getOneCartItem(@Param('id') id: string) {
		return 'getOneCartItem';
	}
	@Post('cart-items')
	@ApiTags('cart-items')
	@ApiOperation({ summary: 'createCartItem' })
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
	createCartItem() {
		return 'createCartItem';
	}
	@Patch('cart-items/:id')
	@ApiTags('cart-items')
	@ApiOperation({ summary: 'updateCartItem' })
	@ApiParam({ name: 'cartID', type: String, description: 'Cart ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				message: 'Updated successfully',
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
	updateCartItem(@Param('id') id: string) {
		return 'updateCartItem';
	}
	@Delete('cart-items/:id')
	@ApiTags('cart-items')
	@ApiOperation({ summary: 'deleteCartItem' })
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
		status: 403,
		schema: {
			example: {
				code: 403,
				message: `You don't have permission to this access`,
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
	deleteCartItem(@Param('id') id: string) {
		return 'deleteCartItem';
	}
	@Post('carts/:cartID/cart-items')
	@ApiTags('cart-items')
	@ApiOperation({ summary: 'createCartItemForCart' })
	@ApiParam({ name: 'cartID', type: String, description: 'Cart ID' })
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
	createCartItemForCart(@Param('cartID') cartID: string) {
		return 'createCartItemForCart';
	}
	@Patch('carts/:cartID/cart-items')
	@ApiTags('cart-items')
	@ApiOperation({ summary: 'updateCartItemForCart' })
	@ApiParam({ name: 'cartID', type: String, description: 'Cart ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				message: 'Updated successfully',
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
	updateCartItemForCart(@Param('cartID') cartID: string) {
		return 'updateCartItemForCart';
	}
	@Delete('carts/:cartID/cart-items/:cart-itemID')
	@ApiTags('cart-items')
	@ApiOperation({ summary: 'deleteCartItemForCart' })
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
		status: 403,
		schema: {
			example: {
				code: 403,
				message: `You don't have permission to this access`,
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
	deleteCartItemForCart(
		@Param('cartID') cartID: string,
		@Param('cartItemID') cartItemID: string,
	) {
		return 'deleteCartItemForCart';
	}
}
