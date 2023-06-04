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
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import {
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { GetCartDto } from './dto/get-cart.dto';
import { ESortField, ESortOrder } from 'src/shared/enum/sort.enum';
import { PurchaseCartDto } from './dto/purchase-cart.dto';

@Controller()
export class CartsController {
	constructor(private readonly cartsService: CartsService) {}
	@Get('carts')
	@ApiTags('/carts')
	@ApiOperation({
		summary: 'getManyCarts',
		description: 'Get many carts',
	})
	@ApiQuery({
		name: 'limit',
		required: false,
		type: Number,
	})
	@ApiQuery({
		name: 'offset',
		required: false,
		type: Number,
	})
	@ApiQuery({
		name: 'search',
		required: false,
		type: String,
	})
	@ApiQuery({
		name: 'sortBy',
		required: false,
		type: ESortField.CREATED_AT,
	})
	@ApiQuery({
		name: 'sortOrder',
		required: false,
		type: ESortOrder.ASC,
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: '_id',
						accountID: 'string',
						cartItemIDs: [{}],
						promotionIDs: [],
						promotionPrice: 0,
						totalPrice: '0',
						createdAt: Date.now(),
						updatedAt: Date.now(),
					},
				],
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					search: 'string',
					sortBy: ESortField.CREATED_AT,
					sortOrder: ESortOrder.ASC,
				},
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
	getManyCarts(@Query() getCartDto: GetCartDto) {
		return 'getManyCarts';
	}

	@Get('carts/:id')
	@ApiTags('/carts')
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
						cartItemIDs: [{}],
						promotionIDs: [],
						promotionPrice: 0,
						totalPrice: '0',
						createdAt: Date.now(),
						updatedAt: Date.now(),
					},
				],
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					search: 'string',
					sortBy: ESortField.CREATED_AT,
					sortOrder: ESortOrder.ASC,
				},
			},
		},
	})
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: 403,
				message: `You don't have permisstion to this access`,
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
	getOneCart(@Param('id') id: string) {
		return 'getOneCart';
	}

	@Post('carts/:id')
	@ApiTags('/carts')
	@ApiOperation({
		summary: 'createCart',
		description: 'Create one cart',
	})
	@ApiParam({ name: 'id', type: String, description: 'Cart ID' })
	@ApiBody({ type: CreateCartDto })
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: 403,
				message: `You don't have permisstion to this access`,
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
	createCart(@Param('id') id: string, @Body() createCartDto: CreateCartDto) {
		return 'createCart';
	}

	@Patch('carts/:id')
	@ApiTags('/carts')
	@ApiOperation({
		summary: 'updateCart',
		description: 'Update one cart',
	})
	@ApiParam({ name: 'id', type: String, description: 'Cart ID' })
	@ApiBody({ type: UpdateCartDto })
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: 403,
				message: `You don't have permisstion to this access`,
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
	updateCart(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
		return 'updateCart';
	}

	@Delete('carts/:id')
	@ApiTags('/carts')
	@ApiOperation({
		summary: 'deleteCart',
		description: 'Delete one cart',
	})
	@ApiParam({ name: 'id', type: String, description: 'Cart ID' })
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: 403,
				message: `You don't have permisstion to this access`,
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
	deleteCart(@Param('id') id: string) {
		return 'deleteCart';
	}

	@Get('carts/me')
	@ApiTags('/carts')
	@ApiOperation({
		summary: 'getCartByCustomer',
		description: 'Allow customers to get their cart',
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: '_id',
						accountID: 'string',
						cartItemIDs: [{}],
						promotionIDs: [],
						promotionPrice: 0,
						totalPrice: '0',
						createdAt: Date.now(),
						updatedAt: Date.now(),
					},
				],
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					search: 'string',
					sortBy: ESortField.CREATED_AT,
					sortOrder: ESortOrder.ASC,
				},
			},
		},
	})
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: 403,
				message: `You don't have permisstion to this access`,
				details: {},
			},
		},
	})
	getCartByCustomer() {
		return 'getCartByCustomer';
	}

	@Post('carts/purchase')
	@ApiTags('/carts')
	@ApiOperation({
		summary: 'purchaseInCart',
		description: 'Allow customers to purchase packages in their cart',
	})
	@ApiBody({ type: PurchaseCartDto })
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: 403,
				message: `You don't have permisstion to this access`,
				details: {},
			},
		},
	})
	purchaseInCart(@Body() purchaseCartDto: PurchaseCartDto) {
		return 'purchaseInCart';
	}
}
