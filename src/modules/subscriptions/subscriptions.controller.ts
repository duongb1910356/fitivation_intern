import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { ErrorResponse } from 'src/shared/response/common-response';
import {
	Subscription,
	SubscriptionStatus,
} from './schemas/subscription.schema';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { RolesGuard } from 'src/guards/role.guard';
import { SubscriptionsService } from './subscriptions.service';
import { ListResponseV2, QueryObject } from 'src/shared/utils/query-api';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { TokenPayload } from '../auth/types/token-payload.type';
import { GetSubscriptionSuccessResponse } from './types/subscription-success-response.type';
import {
	FacilityID,
	PackageID,
	PackageTypeID,
	Photo,
} from '../carts/types/cart-success-response.type';
import { ScheduleType } from '../facility-schedule/entities/facility-schedule.entity';
import { State, Status } from '../facility/schemas/facility.schema';
import { TimeType } from '../package/entities/package.entity';
import { ApiDocsPaginationVer2 } from 'src/decorators/swagger-form-data.decorator-v2';

@Controller('subscriptions')
@ApiTags('subscriptions')
@ApiBearerAuth()
export class SubscriptionsController {
	private populateOpt: any;
	constructor(private readonly subscriptionService: SubscriptionsService) {
		this.populateOpt = {
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
		};
	}

	@ApiDocsPaginationVer2('subscription')
	@ApiOperation({
		summary: 'Find Many Subscriptions',
		description: `Find many subscriptions.\n\nRoles: ${UserRole.ADMIN}, ${UserRole.MEMBER}.`,
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				data: {
					items: [
						{
							_id: 'string',
							accountID: 'string',
							billItemID: 'string',
							packageID: {
								_id: 'string',
								packageTypeID: {
									_id: 'string',
									facilityID: {
										_id: 'string',
										brandID: 'string',
										facilityCategoryID: ['string', 'string'],
										ownerID: 'string',
										name: 'string',
										location: {
											coordinates: [1, 1],
											type: 'Point',
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
										summary: 'string',
										description: 'string',
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
							facilityID: 'string',
							expires: new Date(),
							status: SubscriptionStatus.ACTIVE,
							renew: false,
							createdAt: new Date(),
							updatedAt: new Date(),
						},
					] as GetSubscriptionSuccessResponse[],
					total: 1,
					queryOptions: {
						sort: 'string',
						fields: 'string',
						limit: 10,
						page: 0,
					} as QueryObject,
				} as ListResponseV2<GetSubscriptionSuccessResponse>,
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
	@Get()
	@Roles(UserRole.MEMBER, UserRole.ADMIN)
	@UseGuards(RolesGuard)
	async findManySubscriptions(
		@Query() query: QueryObject,
		@GetCurrentUser() user: TokenPayload,
	): Promise<ListResponseV2<Subscription>> {
		return await this.subscriptionService.findMany(
			query,
			user,
			this.populateOpt,
		);
	}

	@ApiOperation({
		summary: 'Find One Subscription',
		description: `Find one subscription.\n\nRoles: ${UserRole.ADMIN}, ${UserRole.MEMBER}`,
	})
	@ApiParam({ name: 'id', type: String, description: 'Subscription ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				data: {
					_id: 'string',
					accountID: 'string',
					billItemID: 'string',
					facilityID: 'string',
					packageID: {
						_id: 'string',
						packageTypeID: {
							_id: 'string',
							facilityID: {
								_id: 'string',
								brandID: 'string',
								facilityCategoryID: ['string', 'string'],
								ownerID: 'string',
								name: 'string',
								location: {
									coordinates: [1, 1],
									type: 'Point',
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
								summary: 'string',
								description: 'string',
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
					expires: new Date(),
					renew: false,
					status: SubscriptionStatus.ACTIVE,
					createdAt: new Date(),
					updatedAt: new Date(),
				} as GetSubscriptionSuccessResponse,
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
	async findOneSubscription(
		@Param('id') id: string,
		@GetCurrentUser() user: TokenPayload,
	): Promise<Subscription> {
		return await this.subscriptionService.findOneByID(
			id,
			user,
			this.populateOpt,
		);
	}
}
