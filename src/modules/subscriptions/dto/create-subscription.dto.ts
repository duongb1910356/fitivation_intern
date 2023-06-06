import {
	IsNotEmpty,
	IsString,
	IsEnum,
	IsDate,
	IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionStatus } from '../schemas/subscription.schema';

export class CreateSubscriptionDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	accountID: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	billItemID: string;

	@ApiProperty()
	@IsDate()
	expires: Date;

	@ApiProperty()
	@IsBoolean()
	renew?: boolean;

	@ApiProperty()
	@IsEnum(SubscriptionStatus)
	status?: SubscriptionStatus;
}
