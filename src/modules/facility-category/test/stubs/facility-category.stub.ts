import { FacilityCategory } from '../../entities/facility-category';

export const CategoryStub = (): FacilityCategory => {
	return {
		_id: '6493cd02a6a031e19d380fac',
		name: 'GYM',
		type: 'GYM',
		photo: {
			ownerID: '649d344f72e91c40d2e7e895',
			name: '1688024182737-366333986.jpeg',
			imageURL:
				'https://hdfitness.vn/wp-content/uploads/2022/02/tap-gym-la-gi-5-min-scaled.jpg',
			_id: '649d347672e91c40d2e7e89c',
			createdAt: new Date('2023-06-29T07:36:22.758Z'),
			updatedAt: new Date('2023-06-29T07:36:22.758Z'),
		},
		createdAt: new Date('2023-06-22T04:24:34.315Z'),
		updatedAt: new Date('2023-06-22T04:24:34.315Z'),
	};
};
