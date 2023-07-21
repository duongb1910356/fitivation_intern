import { PackageID } from 'src/modules/carts/types/cart-success-response.type';
import { SubscriptionStatus } from '../schemas/subscription.schema';

export type GetSubscriptionSuccessResponse = {
	_id: string;
	accountID: string;
	billItemID: string;
	facilityID: string;
	packageID: PackageID;
	expires: Date;
	renew: boolean;
	status: SubscriptionStatus;
	createdAt: Date;
	updatedAt: Date;
};
