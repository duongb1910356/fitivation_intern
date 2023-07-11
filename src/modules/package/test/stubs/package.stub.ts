import { PackageType } from 'src/modules/package-type/entities/package-type.entity';
import { Package, TimeType } from '../../entities/package.entity';
import { Facility } from 'src/modules/facility/schemas/facility.schema';

export const PackageStub = (): Package => {
	return {
		_id: '6476ef7d1f0419cd330fe128',
		packageTypeID: {
			_id: '6493cd02a6a031e19d380fac',
		} as unknown as PackageType,
		facilityID: { _id: '64931e19d380fac3cd02a6a0' } as unknown as Facility,
		type: TimeType.ONE_MONTH,
		price: 100000,
		benefits: ['Use of bathroom', 'Use of massage chair'],
		createdAt: new Date('2023-06-22T04:24:34.315Z'),
		updatedAt: new Date('2023-06-22T04:24:34.315Z'),
	};
};
