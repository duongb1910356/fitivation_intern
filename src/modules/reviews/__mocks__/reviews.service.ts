import { GetReviewStub } from '../test/stubs/getReview.stub';
import { ReviewStub } from '../test/stubs/review.stub';

export const ReviewService = jest.fn().mockReturnValue({
	create: jest.fn().mockResolvedValueOnce(ReviewStub()),
	delete: jest.fn().mockResolvedValueOnce(ReviewStub()),
	caculateAverageRating: jest.fn(),
	findMany: jest.fn(),
	getReview: jest.fn().mockResolvedValue(GetReviewStub()),
	findOneByID: jest.fn().mockResolvedValueOnce(ReviewStub()),
});
