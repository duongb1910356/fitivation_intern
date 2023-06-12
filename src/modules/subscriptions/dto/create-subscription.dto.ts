import { IsNotEmpty, IsString, IsDate } from 'class-validator';

export class CreateSubscriptionDto {
	@IsString()
	@IsNotEmpty()
	accountID: string;

	@IsString()
	@IsNotEmpty()
	billItemID: string;

	@IsDate()
	expires: Date;
}
