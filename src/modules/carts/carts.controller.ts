import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	UseGuards,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { PurchaseCartDto } from './dto/purchase-cart.dto';
import { ListOptions } from 'src/shared/response/common-response';
import { Cart } from './schemas/cart.schema';
import { ListResponse } from 'src/shared/response/common-response';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import { Roles } from 'src/decorators/role-decorator/role.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { RolesGuard } from 'src/decorators/role-decorator/role.guard';

@Controller()
@ApiBearerAuth()
export class CartsController {
	constructor(private readonly cartsService: CartsService) {}
	@Get('carts')
	@ApiTags('carts')
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN)
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
						cartItemIDs: [],
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
		status: 403,
		schema: {
			example: {
				code: 403,
				message: `You don't have permission to this access`,
				details: {},
			},
		},
	})
	getManyCarts(@Query() filter: ListOptions<Cart>) {
		return 'getManyCarts';
	}

	@Get('carts/:id')
	@ApiTags('carts')
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN)
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
						cartItemIDs: [],
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
	@ApiTags('carts')
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN)
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
	@ApiTags('carts')
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN)
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
	@ApiTags('carts')
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN)
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

	@Post('carts/purchase')
	@ApiTags('carts')
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN, UserRole.MEMBER)
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
				details: null,
			},
		},
	})
	purchaseInCart(@Body() purchaseCartDto: PurchaseCartDto) {
		return 'purchaseInCart';
	}
}
