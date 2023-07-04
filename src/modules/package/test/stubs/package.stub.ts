import { PackageType } from 'src/modules/package-type/entities/package-type.entity';
import { Package, TimeType } from '../../entities/package.entity';
import { Facility } from 'src/modules/facility/schemas/facility.schema';

export const PackageStub = (): Package => {
	return {
		_id: '6476ef7d1f0419cd330fe128',
		packageTypeID: {} as unknown as PackageType,
		facilityID: {} as unknown as Facility,
		type: TimeType.ONE_MONTH,
		price: 100000,
		benefits: ['Use of bathroom', 'Use of massage chair'],
		createdAt: new Date(),
		updatedAt: new Date(),
	};
};
