import { IsBoolean } from 'class-validator';

export class UpdateSubscriptionDto {
	@IsBoolean()
	renew: boolean;
}
