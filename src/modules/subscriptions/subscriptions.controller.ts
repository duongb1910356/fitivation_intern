import {
	Controller,
	Get,
	Param,
	Patch,
	Query,
	UseGuards,
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import { ErrorResponse } from 'src/shared/response/common-response';
import {
	Subscription,
	SubscriptionStatus,
} from './schemas/subscription.schema';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { RolesGuard } from 'src/guards/role.guard';
import { SubscriptionsService } from './subscriptions.service';
import { ListResponse, QueryObject } from 'src/shared/utils/query-api';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { TokenPayload } from '../auth/types/token-payload.type';
import {
	BillItem,
	BillItemStatus,
} from '../bill-items/schemas/bill-item.schema';
import { Package, TimeType } from '../package/entities/package.entity';

@Controller('subscriptions')
@ApiTags('subscriptions')
@ApiBearerAuth()
export class SubscriptionsController {
	constructor(private readonly subscriptionService: SubscriptionsService) {}
	@ApiDocsPagination('subscription')
	@ApiOperation({
		summary: 'findManySubscriptions',
		description: 'Get many subscriptions',
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: '_id',
						accountID: 'string',
						billItemID: {
							_id: 'string',
							brandID: 'string',
							facilityID: 'string',
							packageTypeID: 'string',
							packageID: 'string',
							ownerFacilityID: 'string',
							accountID: 'string',
							promotions: [],
							promotionPrice: 0,
							totalPrice: 0,
							status: BillItemStatus.ACTIVE,
						} as BillItem,
						packageID: {
							_id: 'string',
							packageTypeID: 'string',
							facilityID: 'string',
							type: TimeType.THREE_MONTH,
							price: 0,
							benefits: ['string'],
						} as Package,
						facilityID: {
							_id: 'string',
							location: {
								coordinates: [1, 1],
								type: 'Point',
							},
							brandID: '64944c7c2d7cf0ec0dbb4051',
							facilityCategoryID: ['string', 'string', 'string', 'string'],
							ownerID: 'string',
							name: 'string',
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
							summary: 'string',
							description: 'string',
							coordinates: [1, 1],
							state: 'ACTIVE',
							status: 'APPROVED',
							phone: '84906943567',
							photos: [
								{
									ownerID: 'string',
									name: 'string',
									_id: 'string',
									imageURL: 'Link URL',
								},
							],
							scheduleType: 'DAILY',
						},
						expires: new Date(),
						status: SubscriptionStatus.ACTIVE,
						renew: false,
					} as Subscription,
				] as Subscription[],
				total: 1,
				queryOptions: {
					sort: 'string',
					fields: 'string',
					limit: 10,
					page: 0,
				} as QueryObject,
			} as ListResponse<Subscription>,
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
	@Roles(UserRole.MEMBER, UserRole.ADMIN)
	@UseGuards(RolesGuard)
	findManySubscriptions(
		@Query() query: QueryObject,
		@GetCurrentUser() user: TokenPayload,
	): Promise<ListResponse<Subscription>> {
		return this.subscriptionService.findMany(query, user);
	}
	@ApiOperation({
		summary: 'FindOneSubscription',
		description: 'Get one subscription',
	})
	@ApiParam({ name: 'id', type: String, description: 'Subscription ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				data: {
					_id: '_id',
					accountID: 'string',
					billItemID: {
						_id: 'string',
						brandID: 'string',
						facilityID: 'string',
						packageTypeID: 'string',
						packageID: 'string',
						ownerFacilityID: 'string',
						accountID: 'string',
						promotions: [],
						promotionPrice: 0,
						totalPrice: 0,
						status: BillItemStatus.ACTIVE,
					} as BillItem,
					packageID: {
						_id: 'string',
						packageTypeID: 'string',
						facilityID: 'string',
						type: TimeType.THREE_MONTH,
						price: 0,
						benefits: ['string'],
					} as Package,
					facilityID: {
						_id: 'string',
						location: {
							coordinates: [1, 1],
							type: 'Point',
						},
						brandID: '64944c7c2d7cf0ec0dbb4051',
						facilityCategoryID: ['string', 'string', 'string', 'string'],
						ownerID: 'string',
						name: 'string',
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
						summary: 'string',
						description: 'string',
						coordinates: [1, 1],
						state: 'ACTIVE',
						status: 'APPROVED',
						phone: '84906943567',
						photos: [
							{
								ownerID: 'string',
								name: 'string',
								_id: 'string',
								imageURL: 'Link URL',
							},
						],
						scheduleType: 'DAILY',
					},
					expires: new Date(),
					status: SubscriptionStatus.ACTIVE,
					renew: false,
				} as Subscription,
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
	@Get(':id')
	@Roles(UserRole.MEMBER, UserRole.ADMIN)
	@UseGuards(RolesGuard)
	findOneSubscription(
		@Param('id') id: string,
		@GetCurrentUser() user: TokenPayload,
	): Promise<Subscription> {
		return this.subscriptionService.findOneByID(id, user);
	}

	@ApiOperation({
		summary: 'renew',
		description: 'Allow customer to extend package when package was expired',
	})
	@ApiParam({ name: 'id', type: String, description: 'Subscription ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				_id: '_id',
				accountID: 'string',
				billItemID: {
					_id: 'string',
					brandID: 'string',
					facilityID: 'string',
					packageTypeID: 'string',
					packageID: 'string',
					ownerFacilityID: 'string',
					accountID: 'string',
					promotions: [],
					promotionPrice: 0,
					totalPrice: 0,
					status: BillItemStatus.ACTIVE,
				} as BillItem,
				packageID: {
					_id: 'string',
					packageTypeID: 'string',
					facilityID: 'string',
					type: TimeType.THREE_MONTH,
					price: 0,
					benefits: ['string'],
				} as Package,
				facilityID: {
					_id: 'string',
					location: {
						coordinates: [1, 1],
						type: 'Point',
					},
					brandID: '64944c7c2d7cf0ec0dbb4051',
					facilityCategoryID: ['string', 'string', 'string', 'string'],
					ownerID: 'string',
					name: 'string',
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
					summary: 'string',
					description: 'string',
					coordinates: [1, 1],
					state: 'ACTIVE',
					status: 'APPROVED',
					phone: '84906943567',
					photos: [
						{
							ownerID: 'string',
							name: 'string',
							_id: 'string',
							imageURL: 'Link URL',
						},
					],
					scheduleType: 'DAILY',
				},
				expires: new Date(),
				status: SubscriptionStatus.ACTIVE,
				renew: true,
			} as Subscription,
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
	@Patch('renew/:id')
	@Roles(UserRole.MEMBER)
	@UseGuards(RolesGuard)
	renew(
		@GetCurrentUser() user: TokenPayload,
		@Param('id') id: string,
	): Promise<Subscription> {
		return this.subscriptionService.renew(id, user);
	}
}
