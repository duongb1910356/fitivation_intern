import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum } from 'class-validator';
import { SubscriptionStatus } from '../schemas/subscription.schema';

export class UpdateSubscriptionDto {
	@IsBoolean()
	renew: boolean;

	@IsDate()
	@Type(() => Date)
	expires: Date;

	@IsEnum(SubscriptionStatus)
	status: SubscriptionStatus;
}
