import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import {
	ErrorResponse,
	ListOptions,
	ListResponse,
} from 'src/shared/response/common-response';
import {
	Subscription,
	SubscriptionStatus,
} from './schemas/subscription.schema';

@Controller('subscriptions')
@ApiTags('subscriptions')
export class SubscriptionsController {
	@Get()
	@ApiDocsPagination('subscription')
	@ApiOperation({
		summary: 'getManySubscriptions',
		description: 'Get many subscriptions',
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						accountID: {},
						billItemID: {},
						expires: new Date(),
						status: SubscriptionStatus.ACTIVE,
						renew: false,
					},
				] as Subscription[],
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					searchField: {},
					searchValue: '',
					sortField: 'createdAt',
					sortOrder: 'asc',
				} as ListOptions<Subscription>,
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
	getManySubscriptions(@Query() filter: ListOptions<Subscription>) {
		return 'getManySubscriptions';
	}
	@Get(':id')
	@ApiOperation({
		summary: 'getOneSubscription',
		description: 'Get one subscription',
	})
	@ApiParam({ name: 'id', type: String, description: 'Subscription ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						accountID: {},
						billItemID: {},
						expires: new Date(),
						status: SubscriptionStatus.ACTIVE,
						renew: false,
					},
				] as Subscription[],
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					searchField: {},
					searchValue: '',
					sortField: 'createdAt',
					sortOrder: 'asc',
				} as ListOptions<Subscription>,
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
	getOneSubscription(@Param('id') id: string) {
		return 'getOneSubscription';
	}

	@Patch(':id/renew')
	@ApiParam({ name: 'id', type: String, description: 'Subscription ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				accountID: {},
				billItemID: {},
				expires: new Date(),
				status: SubscriptionStatus.ACTIVE,
				renew: false,
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
	renew(@Param('id') id: string) {
		return 'renew';
	}
}
