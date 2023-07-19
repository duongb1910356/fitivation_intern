import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
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

@Controller('subscriptions')
@ApiTags('subscriptions')
@ApiBearerAuth()
export class SubscriptionsController {
	private populateOpt: any;
	constructor(private readonly subscriptionService: SubscriptionsService) {
		this.populateOpt = {
			path: 'packageID',
			model: 'Package',
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
						accountID: 'string',
						billItemID: 'string',
						packageID: 'string',
						facilityID: 'string',
						expires: new Date(),
						status: SubscriptionStatus.ACTIVE,
						renew: false,
					},
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
	async findManySubscriptions(
		@Query() query: QueryObject,
		@GetCurrentUser() user: TokenPayload,
	): Promise<ListResponse<Subscription>> {
		return await this.subscriptionService.findMany(
			query,
			user,
			this.populateOpt,
		);
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
				items: [
					{
						accountID: 'string',
						billItemID: 'string',
						packageID: 'string',
						facilityID: 'string',
						expires: new Date(),
						status: SubscriptionStatus.ACTIVE,
						renew: false,
					},
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
