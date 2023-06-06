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
import {
	Subscription,
	SubscriptionStatus,
} from './schemas/subscription.schema';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Controller('subscriptions')
export class SubscriptionsController {
	@Get('subscriptions')
	@ApiTags('subscriptions')
	@ApiDocsPagination('subscription')
	@ApiOperation({
		summary: 'getManySubscriptions',
		description: 'Get many subscriptions',
	})
	@ApiBody({ type: CreateSubscriptionDto })
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
	getManySubscriptions(
		@Query() filter: ListOptions<Subscription>,
		@Body() createSubscriptionDto: CreateSubscriptionDto,
	) {
		return 'getManySubscriptions';
	}
	@Get('subscriptions/:id')
	@ApiTags('subscriptions')
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
	@Post('subscriptions')
	@ApiTags('subscriptions')
	@ApiOperation({
		summary: 'createSubscription',
		description: 'Create one subscription',
	})
	@ApiParam({ name: 'id', type: String, description: 'Subscription ID' })
	@ApiBody({ type: CreateSubscriptionDto })
	@ApiResponse({
		status: 201,
		schema: {
			example: {
				accountID: {},
				billItemID: {},
				expires: new Date(),
				status: SubscriptionStatus.ACTIVE,
				renew: false,
				createdAt: new Date(),
				updatedAt: new Date(),
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
		status: 403,
		schema: {
			example: {
				code: '403',
				message: `Forbidden resource`,
				details: null,
			} as ErrorResponse<null>,
		},
	})
	createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto) {
		return 'createSubscription';
	}
	@Patch('subscriptions/:id')
	@ApiTags('subscriptions')
	@ApiOperation({
		summary: 'updateSubscription',
		description: 'Update one subscription',
	})
	@ApiParam({ name: 'id', type: String, description: 'Subscription ID' })
	@ApiBody({ type: UpdateSubscriptionDto })
	@ApiResponse({
		status: 201,
		schema: {
			example: {
				accountID: {},
				billItemID: {},
				expires: new Date(),
				status: SubscriptionStatus.ACTIVE,
				renew: false,
				createdAt: new Date(),
				updatedAt: new Date(),
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
	updateSubscription(
		@Param('id') id: string,
		@Body() updateSubscriptionDto: UpdateSubscriptionDto,
	) {
		return 'updateSubscription';
	}
	@Delete('subscriptions/:id')
	@ApiTags('subscriptions')
	@ApiOperation({
		summary: 'deleteSubscription',
		description: 'Delete one subscription',
	})
	@ApiParam({ name: 'id', type: String, description: 'Subscription ID' })
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
	deleteSubscription(@Param('id') id: string) {
		return 'deleteSubscription';
	}
	@Post('bill-items/:billItemID/subscriptions')
	@ApiTags('bill-items/subscriptions')
	@ApiOperation({
		summary: 'createSubscriptionForBillItem',
		description: 'Create Subscription when user purchase',
	})
	@ApiParam({ name: 'billItemID', type: String, description: 'Bill-item ID' })
	@ApiBody({ type: CreateSubscriptionDto })
	@ApiResponse({
		status: 201,
		schema: {
			example: {
				accountID: {},
				billItemID: {},
				expires: new Date(),
				status: SubscriptionStatus.ACTIVE,
				renew: false,
				createdAt: new Date(),
				updatedAt: new Date(),
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
	createSubscriptionForBillItem(
		@Param('billItemID') billItemID: string,
		@Body() createSubscriptionDto: CreateSubscriptionDto,
	) {
		return 'createSubscription';
	}
}
