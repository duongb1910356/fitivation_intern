import { State, Status } from 'src/modules/facility/schemas/facility.schema';
import { TimeType } from 'src/modules/package/entities/package.entity';
import { ScheduleType } from 'src/modules/facility-schedule/entities/facility-schedule.entity';

export const cartStub = (): any => {
	return {
		_id: '64bd0a6ab62ccdaa60e22cc0',
		accountID: '64bd0a6fc8d5928f7897e90b',
		cartItemIDs: [
			{
				_id: '64bcef03dfcb51ae859b6d4e',
				packageID: {
					_id: '649dd2e7e895344f72e91c42',
					packageTypeID: {
						_id: '6476ef7d1f0419cd330fe682',
						facilityID: {
							location: {
								coordinates: [105.77827419395031, 10.044071865857335],
								type: 'Point',
							},
							_id: '649d344f72e91c40d2e7e895',
							createdAt: new Date('2023-06-29T07:35:43.345Z'),
							updatedAt: new Date('2023-06-29T07:36:49.766Z'),
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
							state: State.ACTIVE,
							status: Status.APPROVED,
							phone: '84906943567',
							photos: [
								{
									createdAt: new Date('2023-06-29T07:36:22.758Z'),
									updatedAt: new Date('2023-06-29T07:36:22.758Z'),
									ownerID: '649d344f72e91c40d2e7e895',
									name: '1688024182737-366333986.jpeg',
									_id: '649d347672e91c40d2e7e89c',
								},
								{
									createdAt: new Date('2023-06-29T07:36:22.758Z'),
									updatedAt: new Date('2023-06-29T07:36:22.758Z'),
									ownerID: '649d344f72e91c40d2e7e895',
									name: '1688024182746-73042410.png',
									_id: '649d347672e91c40d2e7e89d',
								},
								{
									createdAt: new Date('2023-06-29T07:36:22.758Z'),
									updatedAt: new Date('2023-06-29T07:36:22.758Z'),
									ownerID: '649d344f72e91c40d2e7e895',
									name: '1688024182724-411896153.png',
									_id: '649d347672e91c40d2e7e89b',
								},
								{
									createdAt: new Date('2023-06-29T07:36:22.758Z'),
									updatedAt: new Date('2023-06-29T07:36:22.758Z'),
									ownerID: '649d344f72e91c40d2e7e895',
									name: '1688024182696-205093289.png',
									_id: '649d347672e91c40d2e7e899',
								},
								{
									createdAt: new Date('2023-06-29T07:36:22.758Z'),
									updatedAt: new Date('2023-06-29T07:36:22.758Z'),
									ownerID: '649d344f72e91c40d2e7e895',
									name: '1688024182709-1336106.png',
									_id: '649d347672e91c40d2e7e89a',
								},
							],
							scheduleType: ScheduleType.DAILY,
						},
						name: 'SPA PA',
						description: 'Gói chăm sóc Spa',
						price: 150000,
						order: 1,
						createdAt: new Date('2023-07-11T08:08:14.847Z'),
						updatedAt: new Date('2023-07-11T08:08:14.847Z'),
					},
					type: TimeType.TWO_MONTH,
					price: 3300000,
					benefits: ['Use of bathroom'],
					createdAt: new Date('2023-07-11T08:08:14.832Z'),
					updatedAt: new Date('2023-07-11T08:08:14.832Z'),
				},
				promotionIDs: [],
				promotionPrice: 0,
				totalPrice: 3300000,
				createdAt: new Date('2023-07-23T09:12:35.520Z'),
				updatedAt: new Date('2023-07-23T09:15:07.988Z'),
			},
		],
		promotionIDs: [],
		promotionPrice: 0,
		totalPrice: 0,
		createdAt: new Date('2023-07-23T09:12:35.520Z'),
		updatedAt: new Date('2023-07-23T09:15:07.988Z'),
	};
};
