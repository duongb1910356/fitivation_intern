import {
	CustomerType,
	Promotion,
	PromotionMethod,
	PromotionStatus,
	PromotionType,
} from '../../schemas/promotion.schema';

export const PackagePromotionStub = (): Promotion => {
	return {
		_id: '6476ef7d1f0419cd330fe128',
		name: 'promotion',
		description: 'string',
		value: 10000,
		method: PromotionMethod.NUMBER,
		minPriceApply: 100000,
		maxValue: 10000,
		startDate: new Date('2023-06-22T04:24:34.315Z'),
		endDate: new Date('2023-08-22T04:24:34.315Z'),
		customerType: CustomerType.MEMBER,
		type: PromotionType.PACKAGE,
		status: PromotionStatus.ACTIVE,
		createdAt: new Date('2023-06-22T04:24:34.315Z'),
		updatedAt: new Date('2023-06-22T04:24:34.315Z'),
	};
};
