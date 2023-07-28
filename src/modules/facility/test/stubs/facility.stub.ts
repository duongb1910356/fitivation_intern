import { Facility, State, Status } from '../../schemas/facility.schema';

export const FacilityStub = (): Facility => {
	return {
		_id: '649d344f72e91c40d2e7e895',
		createdAt: new Date('2023-07-19T08:18:04.988Z'),
		updatedAt: new Date('2023-07-19T08:18:04.988Z'),
		brandID: '64944c7c2d7cf0ec0dbb4051',
		facilityCategoryID: [
			'649d3f7372e91c40d2e7e9dc',
			'649d3f7b72e91c40d2e7e9de',
			'649d3f8672e91c40d2e7e9e0',
			'649d3f6972e91c40d2e7e9da',
		],
		ownerID: '6497c6807a114f5b35a393fd',
		name: 'Gym Thái Sơn',
		address: {
			street: '54 Hùng Vương',
			commune: 'An Hội',
			communeCode: '066',
			district: 'Ninh Kiều',
			districtCode: '067',
			province: 'Cần Thơ',
			provinceCode: '065',
		},
		fullAddress: 'An Hội, Ninh Kiều, Cần Thơ',
		summary: 'Chất lượng là danh dự',
		description:
			"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
		coordinates: [45, 50],
		location: {
			coordinates: [105.77827419395031, 10.044071865857335],
			type: 'Point',
			index: '2dsphere',
		},
		state: State.ACTIVE,
		status: Status.APPROVED,
		phone: '84906943567',
		averageStar: 4,
		photos: [
			{
				createdAt: new Date('2023-06-29T07:36:22.758Z'),
				updatedAt: new Date('2023-06-29T07:36:22.758Z'),
				ownerID: '649d344f72e91c40d2e7e895',
				name: '1688024182737-366333986.jpeg',
				imageURL:
					'https://hdfitness.vn/wp-content/uploads/2022/02/tap-gym-la-gi-5-min-scaled.jpg',
				_id: '649d347672e91c40d2e7e89c',
			},
		],
		reviews: [
			{
				accountID: '649a8f8ab185ffb672485391',
				facilityID: '649d344f72e91c40d2e7e895',
				rating: 2,
				comment: 'ct7gxfhw8p8',
				photos: [],
				_id: '649d348d72e91c40d2e7e8b6',
				createdAt: new Date('2023-07-19T08:18:04.988Z'),
				updatedAt: new Date('2023-07-19T08:18:04.988Z'),
			},
			{
				accountID: '649a8f8ab185ffb672485391',
				facilityID: '649d344f72e91c40d2e7e895',
				rating: 5,
				comment: '46bcpb2u40p',
				photos: [],
				_id: '649d348e72e91c40d2e7e8c2',
				createdAt: new Date('2023-07-19T08:18:04.988Z'),
				updatedAt: new Date('2023-07-19T08:18:04.988Z'),
			},
		],
		schedule: '64b4aff0f4f2b881b96475ea',
	};
};
