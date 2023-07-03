import { Facility } from 'src/modules/facility/schemas/facility.schema';
import { PackageType } from '../../entities/package-type.entity';

export const PackageTypeStub = (): PackageType => {
	return {
		_id: '6493cd02a6a031e19d380fac',
		facilityID: { _id: '64931e19d380fac3cd02a6a0' } as unknown as Facility,
		name: 'GYM GYM 1',
		description: 'cơ sở tập gym chất lượng',
		price: 100000,
		order: 0,
		createdAt: new Date('2023-06-22T04:24:34.315Z'),
		updatedAt: new Date('2023-06-22T04:24:34.315Z'),
	};
};
