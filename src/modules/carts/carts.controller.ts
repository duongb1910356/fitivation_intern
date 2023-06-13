import {
	Controller,
	Get,
	Post,
	Param,
	Query,
	UseGuards,
	Body,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import {
	ApiBearerAuth,
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

@Controller()
@ApiBearerAuth()
export class CartsController {
	constructor(private readonly cartsService: CartsService) {}
	@Get('carts')
	@ApiTags('carts')
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
						accountID: {},
						CartItemIDs: {},
						promotionIDs: {},
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
	getManyCarts(@Query() filter: ListOptions<Cart>) {
		return 'getManyCarts';
	}

	@Get('carts/:id')
	@ApiTags('carts')
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
						accountID: {},
						CartItemIDs: {},
						promotionIDs: {},
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
	getOneCart(@Param('id') id: string) {
		return 'getOneCart';
	}

	@Post('carts/purchase')
	@ApiTags('carts')
	@ApiOperation({
		summary: 'purchaseInCart',
		description: 'Allow customers to purchase packages in their cart',
	})
	@ApiBody({
		type: PurchaseDto,
		examples: {
			example1: {
				value: {
					CartItemIDs: {},
					promotionIDs: [],
					createdAt: new Date(),
					updatedAt: new Date(),
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
	purchaseInCart(@Body() purchaseDto: PurchaseDto) {
		return 'purchaseInCart';
	}
}
