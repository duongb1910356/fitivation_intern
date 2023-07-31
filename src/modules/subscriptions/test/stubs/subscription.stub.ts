import {
	Subscription,
	SubscriptionStatus,
} from 'src/modules/subscriptions/schemas/subscription.schema';

export const subscriptionStub = (): Subscription => {
	return {
		_id: '64b5fb7409c136b1b2789db6',
		accountID: '649a8f8ab185ffb672485391',
		billItemID: '64b5fb7409c136b1b2789dc6',
		packageID: '649dd2e7e895344f72e91c42',
		facilityID: '649d344f72e91c40d2e7e895',
		expires: new Date('2023-08-18T08:50:57.500Z'),
		status: SubscriptionStatus.ACTIVE,
		renew: false,
		createdAt: new Date('2023-07-18T02:39:48.020Z'),
		updatedAt: new Date('2023-07-19T08:50:57.501Z'),
	};
};
