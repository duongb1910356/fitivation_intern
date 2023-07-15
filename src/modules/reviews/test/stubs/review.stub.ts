import { Review } from '../../schemas/reviews.schema';

export const ReviewStub = (): Review => {
	return {
		_id: '649d348d72e91c40d2e7e8b6',
		accountID: '649a8f8ab185ffb672485391',
		facilityID: '649d344f72e91c40d2e7e895',
		rating: 2,
		comment: 'ct7gxfhw8p8',
		photos: [],
		createdAt: new Date('2023-06-29T07:36:22.758Z'),
		updatedAt: new Date('2023-06-29T07:36:22.758Z'),
	};
};
