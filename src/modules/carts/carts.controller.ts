import {
	Controller,
	Get,
	Param,
	UseGuards,
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
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import {
	CartItemIDs,
	GetCartSuccessResponse,
	FacilityID,
	PackageID,
	PackageTypeID,
	Photo,
} from './types/cart-success-response.type';
import { TimeType } from '../package/entities/package.entity';
import { ScheduleType } from '../facility-schedule/entities/facility-schedule.entity';
import { State, Status } from '../facility/schemas/facility.schema';

@Controller('carts')
@ApiTags('carts')
@ApiBearerAuth()
export class CartsController {
	private populateOpt: any;
	constructor(private readonly cartsService: CartsService) {
		this.populateOpt = {
			path: 'cartItemIDs',
			model: 'CartItem',
			populate: {
				path: 'packageID',
				model: 'Package',
				select: '-facilityID',
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
		};
	}

	@ApiOperation({
		summary: 'Get Current User Cart',
		description: 'Get current login user cart',
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				_id: '_id',
				accountID: 'string',
				cartItemIDs: [
					{
						_id: 'string',
						packageID: {
							_id: 'string',
							packageTypeID: {
								_id: 'string',
								facilityID: {
									_id: 'string',
									brandID: 'string',
									facilityCategoryID: 'string',
									ownerID: 'string',
									name: 'string',
									location: {
										coordinates: [1, 1],
										types: 'point',
									},
									address: {
										street: 'string',
										commune: 'string',
										communeCode: 'string',
										district: 'string',
										districtCode: 'string',
										province: 'string',
										provinceCode: 'string',
									},
									fullAddress: 'string',
									phone: 'string',
									photos: [
										{
											_id: 'string',
											ownerID: 'string',
											name: 'string',
											createdAt: new Date(),
											updatedAt: new Date(),
										},
									] as Photo[],
									scheduleType: ScheduleType.DAILY,
									state: State.ACTIVE,
									status: Status.APPROVED,
									createdAt: new Date(),
									updatedAt: new Date(),
								} as FacilityID,
								name: 'string',
								description: 'string',
								price: 0,
								order: 1,
								createdAt: new Date(),
								updatedAt: new Date(),
							} as PackageTypeID,
							type: TimeType.ONE_MONTH,
							price: 0,
							benefits: ['string', 'string'],
							createdAt: new Date(),
							updatedAt: new Date(),
						} as PackageID,
						promotionIDs: [],
						promotionPrice: 0,
						totalPrice: 0,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				] as CartItemIDs[],
				promotionIDs: [],
				promotionPrice: 0,
				totalPrice: 0,
				createdAt: new Date(),
				updatedAt: new Date(),
			} as GetCartSuccessResponse,
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
		return await this.cartsService.getCurrent(userID, this.populateOpt);
	}

	@ApiOperation({
		summary: 'Add Cart Item To Current Cart',
		description: `Add Cart-item to current login user's cart`,
	})
	@ApiParam({ name: 'packageID', type: String, description: 'Package ID' })
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
		summary: 'Remove Cart Item To Current Cart',
		description: `Remove cart-item to current Cart`,
	})
	@ApiParam({ name: 'packageID', type: String, description: 'Package ID' })
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
