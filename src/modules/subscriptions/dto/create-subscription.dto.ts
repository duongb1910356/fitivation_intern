import {
	IsNotEmpty,
	IsString,
	IsEnum,
	IsDate,
	IsBoolean,
} from 'class-validator';
import { SubscriptionStatus } from '../schemas/subscription.schema';

export class CreateSubscriptionDto {
	@IsString()
	@IsNotEmpty()
	accountID: string;

	@IsString()
	@IsNotEmpty()
	billItemID: string;

	@IsDate()
	expires: Date;

	@IsBoolean()
	renew?: boolean;

	@IsEnum(SubscriptionStatus)
	status?: SubscriptionStatus;
}
