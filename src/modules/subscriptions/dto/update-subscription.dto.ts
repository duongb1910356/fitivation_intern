import { Type } from 'class-transformer';
import { IsBoolean, IsDate } from 'class-validator';

export class UpdateSubscriptionDto {
	@IsBoolean()
	renew: boolean;

	@IsDate()
	@Type(() => Date)
	expires: Date;
}
