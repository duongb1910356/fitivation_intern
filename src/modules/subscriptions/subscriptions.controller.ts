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
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import {
	Subscription,
	SubscriptionStatus,
} from './schemas/subscription.schema';

@Controller('subscriptions')
export class SubscriptionsController {
	@Get('subscriptions')
	@ApiTags('subscriptions')
	@ApiDocsPagination('subscription')
	@ApiOperation({ summary: 'getManySubscriptions' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						accountID: {},
						billItemID: {},
						packageID: {},
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
	getManySubscriptions(@Query() filter: ListOptions<Subscription>) {
		return 'getManySubscriptions';
	}
	@Get('subscriptions/:id')
	@ApiTags('subscriptions')
	@ApiOperation({ summary: 'getOneSubscription' })
	@ApiParam({ name: 'id', type: String, description: 'Subscription ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						accountID: {},
						billItemID: {},
						packageID: {},
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
	getOneSubscription(@Param('id') id: string) {
		return 'getOneSubscription';
	}
	@Post('subscriptions')
	@ApiTags('subscriptions')
	@ApiOperation({ summary: 'createSubscription' })
	@ApiParam({ name: 'id', type: String, description: 'Subscription ID' })
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
	createSubscription() {
		return 'createSubscription';
	}
	@Patch('subscriptions/:id')
	@ApiTags('subscriptions')
	@ApiOperation({ summary: 'updateSubscription' })
	@ApiParam({ name: 'id', type: String, description: 'Subscription ID' })
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
	updateSubscription(@Param('id') id: string) {
		return 'updateSubscription';
	}
	@Delete('subscriptions/:id')
	@ApiTags('subscriptions')
	@ApiOperation({ summary: 'deleteSubscription' })
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
	deleteSubscription(@Param('id') id: string) {
		return 'deleteSubscription';
	}
	@Post('bill-items/:billItemID/subscriptions')
	@ApiTags('bill-items/subscriptions')
	@ApiOperation({ summary: 'createSubscriptionForBillItem' })
	@ApiParam({ name: 'billItemID', type: String, description: 'Bill-item ID' })
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
	createSubscriptionForBillItem(@Param('billItemID') billItemID: string) {
		return 'createSubscription';
	}
}
