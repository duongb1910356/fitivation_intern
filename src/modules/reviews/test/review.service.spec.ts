import { Model, Types } from 'mongoose';
import { Review } from '../schemas/reviews.schema';
import { PhotoService } from 'src/modules/photo/photo.service';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from '../reviews.service';
import { CreateReviewDto } from '../dto/create-review-dto';
import { ReviewStub } from './stub/review.stub';
import { PhotoStub } from 'src/modules/photo/test/stub/photo.stub';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { Photo } from 'src/modules/photo/schemas/photo.schema';
import { BadRequestException } from '@nestjs/common';

jest.mock('../../photo/photo.service');
describe('ReviewService', function () {
	let photoService: PhotoService;
	let reviewService: ReviewService;
	let reviewModel: Model<Review>;

	const mockModel = {
		create: jest.fn().mockReturnValue(ReviewStub),
		find: jest.fn(),
		findById: jest.fn(),
		findOneAndDelete: jest.fn(),
		aggregate: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ReviewService,
				PhotoService,
				{
					provide: getModelToken(Review.name),
					useValue: mockModel,
				},
			],
		}).compile();

		reviewService = module.get<ReviewService>(ReviewService);
		photoService = module.get<PhotoService>(PhotoService);
		reviewModel = module.get<Model<Review>>(getModelToken(Review.name));
	});

	it('should be defined', () => {
		expect(reviewService).toBeDefined();
	});
	it('reviewModel should be defined', () => {
		expect(reviewModel).toBeDefined();
	});

	describe('create', () => {
		it('should create a new review without photos', async () => {
			const req = { user: { sub: 'user-id' } };
			const reviewDto: CreateReviewDto = {
				accountID: '649a8f8ab185ffb672485391',
				facilityID: '649d344f72e91c40d2e7e895',
				rating: 2,
				comment: 'ct7gxfhw8p8',
				photos: [],
			};

			const createSpy = jest
				.spyOn(mockModel, 'create')
				.mockResolvedValue(ReviewStub());

			const saveMock = jest.fn().mockResolvedValue(ReviewStub());
			const createdReviewMock = {
				...ReviewStub(),
				save: saveMock,
			};

			createSpy.mockResolvedValue(createdReviewMock);
			const result = await reviewService.create(req, reviewDto);

			expect(createSpy).toHaveBeenCalledWith(reviewDto);
			expect(saveMock).not.toHaveBeenCalled();
			expect(result).toEqual(createdReviewMock);
		});

		it('should create a new review with photos', async () => {
			// Mock data
			const ReviewStub2 = {
				_id: '649d348d72e91c40d2e7e8b6',
				accountID: '649a8f8ab185ffb672485391',
				facilityID: '649d344f72e91c40d2e7e895',
				rating: 2,
				comment: 'ct7gxfhw8p8',
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
				createdAt: new Date('2023-06-29T07:36:22.758Z'),
				updatedAt: new Date('2023-06-29T07:36:22.758Z'),
			};
			const req = { user: { sub: '649a8f8ab185ffb672485391' } };
			const reviewDto: CreateReviewDto = {
				accountID: '649a8f8ab185ffb672485391',
				facilityID: '649d344f72e91c40d2e7e895',
				rating: 2,
				comment: 'ct7gxfhw8p8',
				photos: [],
			};
			const files = {
				images: [
					{
						fieldname: 'fieldname',
						originalname: 'example.jpg',
						encoding: '7bit',
						mimetype: 'image/jpeg',
						size: 12345,
						buffer: Buffer.from('example image buffer'),
						stream: null,
						destination: 'path/to/destination',
						filename: 'example.jpg',
						path: '/path/to/file.jpg',
					},
				],
			};

			const createSpy = jest
				.spyOn(mockModel, 'create')
				.mockResolvedValue(ReviewStub2);

			const saveMock = jest.fn().mockResolvedValue(ReviewStub2);
			const createdReviewMock = {
				...ReviewStub2,
				save: saveMock,
			};

			createSpy.mockResolvedValue(createdReviewMock);

			jest.spyOn(photoService, 'uploadManyFile').mockResolvedValueOnce({
				items: [PhotoStub()],
				total: 1,
				options: {},
			} as ListResponse<Photo>);

			const result = await reviewService.create(req, reviewDto, files);

			expect(mockModel.create).toHaveBeenCalledWith(reviewDto);
			expect(photoService.uploadManyFile).toHaveBeenCalledWith(
				files,
				ReviewStub2._id,
			);
			expect(result).toEqual(createdReviewMock);
		});

		it('should throw an error if the review creation fails', async () => {
			const req = { user: { sub: '649a8f8ab185ffb672485391' } };
			const reviewDto: CreateReviewDto = {
				accountID: '649a8f8ab185ffb672485391',
				facilityID: '649d344f72e91c40d2e7e895',
				rating: 2,
				comment: 'ct7gxfhw8p8',
				photos: [],
			};

			jest
				.spyOn(mockModel, 'create')
				.mockRejectedValueOnce(new Error('Review creation failed'));

			expect(reviewService.create(req, reviewDto)).rejects.toThrow(
				new BadRequestException('Review creation failed'),
			);
		});

		it('should throw an error if the images of review creation fails', async () => {
			const req = { user: { sub: '649a8f8ab185ffb672485391' } };
			const reviewDto: CreateReviewDto = {
				accountID: '649a8f8ab185ffb672485391',
				facilityID: '649d344f72e91c40d2e7e895',
				rating: 2,
				comment: 'ct7gxfhw8p8',
				photos: [],
			};

			const ReviewStub2 = {
				_id: '649d348d72e91c40d2e7e8b6',
				accountID: '649a8f8ab185ffb672485391',
				facilityID: '649d344f72e91c40d2e7e895',
				rating: 2,
				comment: 'ct7gxfhw8p8',
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
				createdAt: new Date('2023-06-29T07:36:22.758Z'),
				updatedAt: new Date('2023-06-29T07:36:22.758Z'),
			};

			const files = {
				images: [
					{
						fieldname: 'fieldname',
						originalname: 'example.jpg',
						encoding: '7bit',
						mimetype: 'image/jpeg',
						size: 12345,
						buffer: Buffer.from('example image buffer'),
						stream: null,
						destination: 'path/to/destination',
						filename: 'example.jpg',
						path: '/path/to/file.jpg',
					},
				],
			};

			const createSpy = jest
				.spyOn(mockModel, 'create')
				.mockResolvedValue(ReviewStub2);

			const deleteMock = jest.fn();
			const createdReviewMock = {
				...ReviewStub2,
				delete: deleteMock,
			};

			createSpy.mockResolvedValue(createdReviewMock);

			jest
				.spyOn(photoService, 'uploadManyFile')
				.mockRejectedValueOnce(new Error('Photo creation failed'));

			const result = reviewService.create(req, reviewDto, files);
			await expect(result).rejects.toThrow(
				new BadRequestException('Review creation failed'),
			);
			expect(deleteMock).toHaveBeenCalled();
		});
	});

	describe('delete', () => {
		const deletedReview: Review = {
			_id: '64ae28029e4c9b85da86355f',
			accountID: '6497c6807a114f5b35a393fd',
			facilityID: '649011312a7e17d72b9d724b',
			rating: 2,
			comment: 'abc',
			photos: [
				{
					createdAt: new Date('2023-07-12T04:11:46.344Z'),
					updatedAt: new Date('2023-07-12T04:11:46.344Z'),
					ownerID: '64ae28029e4c9b85da86355f',
					name: '1689135106229-427152940.jpeg',
					imageURL:
						'http://localhost:8080/64ae28029e4c9b85da86355f/1689135106229-427152940.jpeg',
					_id: '64ae28029e4c9b85da863561',
				},
			],
			createdAt: new Date('2023-07-12T04:11:46.344Z'),
			updatedAt: new Date('2023-07-12T04:11:46.344Z'),
		};

		it('should delete the review and its associated photos', async () => {
			const reviewId = '649d348d72e91c40d2e7e8b6';

			jest
				.spyOn(mockModel, 'findOneAndDelete')
				.mockResolvedValue(deletedReview);
			jest.spyOn(photoService, 'delete').mockImplementation(jest.fn());

			const result = await reviewService.delete(reviewId);

			expect(result).toEqual(deletedReview);
			expect(mockModel.findOneAndDelete).toHaveBeenCalledWith({
				_id: reviewId,
			});
			expect(photoService.delete).toHaveBeenCalledTimes(
				deletedReview.photos.length,
			);
			deletedReview.photos.forEach((el) => {
				expect(photoService.delete).toHaveBeenCalledWith(el._id);
			});
		});

		it('should handle errors during photo deletion', async () => {
			const reviewId = '649d348d72e91c40d2e7e8b6';

			jest.spyOn(mockModel, 'findOneAndDelete').mockResolvedValue(undefined);

			const result = await reviewService.delete(reviewId);

			expect(result).toEqual(undefined);
		});
	});

	describe('caculateAverageRating', () => {
		it('should caculate average rating the reviews of facility', async () => {
			const facilityID = '649d348d72e91c40d2e7e8b6';
			const objectId = new Types.ObjectId(facilityID);

			const aggregateMock = [{ _id: null, averageStar: 5 }];

			jest.spyOn(mockModel, 'aggregate').mockResolvedValue(aggregateMock);
			const result = await reviewService.caculateAverageRating(facilityID);

			expect(mockModel.aggregate).toHaveBeenCalledWith([
				{ $match: { facilityID: objectId } },
				{ $group: { _id: null, averageStar: { $avg: '$rating' } } },
			]);

			expect(result).toEqual(aggregateMock[0].averageStar);
		});

		it('should return undefined when no reviews are available', async () => {
			const facilityID = '649d348d72e91c40d2e7e8b6';
			jest.spyOn(mockModel, 'aggregate').mockResolvedValue([]);

			const result = await reviewService.caculateAverageRating(facilityID);

			expect(result).toBeUndefined();
		});

		it('should handle errors when aggregate failed', async () => {
			const facilityID = '649d348d72e91c40d2e7e8b6';
			jest
				.spyOn(mockModel, 'aggregate')
				.mockRejectedValue(new Error('Aggregate failed'));

			const result = await reviewService.caculateAverageRating(facilityID);

			expect(result).toBeUndefined();
		});
	});

	describe('findMany', () => {
		it('should return a list of reviews based on the provided filter', async () => {
			const filter: ListOptions<Review> = {
				sortField: 'createdAt',
				sortOrder: 'desc',
				limit: 10,
				offset: 0,
			};

			const mockResult = [ReviewStub(), ReviewStub()];
			jest.spyOn(mockModel, 'find').mockReturnValueOnce({
				sort: jest.fn().mockReturnThis(),
				skip: jest.fn().mockReturnThis(),
				limit: jest.fn().mockResolvedValueOnce(mockResult),
			} as any);

			const result = await reviewService.findMany(filter);

			expect(mockModel.find).toHaveBeenCalledWith(filter);
			expect(result.items).toEqual(mockResult);
			expect(result.total).toBe(mockResult.length);
			expect(result.options).toEqual(filter);
		});

		it('should return an empty list when no review match the filter', async () => {
			const filter: ListOptions<Review> = {
				sortField: 'createdAt',
				sortOrder: 'asc',
				limit: 10,
				offset: 0,
			};

			jest.spyOn(mockModel, 'find').mockImplementation(() => ({
				sort: () => ({
					skip: () => ({
						limit: jest.fn().mockResolvedValue([]),
					}),
				}),
			}));

			const result = await reviewService.findMany(filter);

			expect(mockModel.find).toHaveBeenCalledWith(filter);
			expect(result.items).toEqual([]);
			expect(result.total).toBe(0);
			expect(result.options).toEqual(filter);
		});

		it('should handle errors and throw BadRequestException', async () => {
			const filter: ListOptions<Review> = {
				sortField: 'createdAt',
				sortOrder: 'desc',
				limit: 10,
				offset: -70,
			};

			jest.spyOn(mockModel, 'find').mockImplementation(() => {
				throw new Error('An error occurred while retrieving reviews');
			});

			await expect(reviewService.findMany(filter)).rejects.toThrow(
				BadRequestException,
			);
		});
	});

	describe('getReview', () => {
		it('should return a list of reviews with pagination and sorting', async () => {
			const facilityID = '649d348d72e91c40d2e7e8b6';
			const filter: ListOptions<Review> = {
				sortField: 'createdAt',
				sortOrder: 'desc',
				limit: 10,
				offset: 0,
			};

			const mockResult = [
				{
					_id: '649d348d72e91c40d2e7e8b6',
					accountID: {
						_id: '649a8f8ab185ffb672485391',
						username: 'customer1',
						avatar: {
							ownerID: '649a8f8ab185ffb672485391',
							name: '1688617419667-297579427.png',
							imageURL:
								'https://genk.mediacdn.vn/139269124445442048/2022/6/5/v2-5a6e8ad7267ad465c5bb19a28e4decc2720w-1654418988025141565126.jpg',
							_id: '64ab740b399a06e76eb474e5',
							createdAt: '2023-07-10T02:59:23.437Z',
							updatedAt: '2023-07-10T02:59:23.437Z',
						},
					},
					facilityID: '649d344f72e91c40d2e7e895',
					rating: 2,
					comment: 'ct7gxfhw8p8',
					photos: [],
					__v: 0,
				},
			];

			jest.spyOn(mockModel, 'find').mockReturnValueOnce({
				sort: jest.fn().mockReturnThis(),
				skip: jest.fn().mockReturnThis(),
				limit: jest.fn().mockReturnThis(),
				populate: jest.fn().mockResolvedValue(mockResult),
			} as any);

			const result = await reviewService.getReview(facilityID, filter);

			expect(result.items).toEqual(mockResult);
			expect(result.total).toBe(mockResult.length);
			expect(result.options).toEqual(filter);
			expect(mockModel.find).toHaveBeenCalledWith(filter);
		});

		it('should handle errors and throw BadRequestException', async () => {
			const facilityID = '649d348d72e91c40d2e7e8b6';
			const filter: ListOptions<Review> = {
				sortField: 'createdAt',
				sortOrder: 'desc',
				limit: 10,
				offset: -10,
			};

			jest.spyOn(mockModel, 'find').mockImplementation(() => {
				throw new Error('An error occurred while retrieving reviews');
			});

			await expect(reviewService.getReview(facilityID, filter)).rejects.toThrow(
				BadRequestException,
			);
		});
	});

	describe('findOneByID', () => {
		it('should find a review by ID', async () => {
			const reviewId = '649d348d72e91c40d2e7e8b6';

			const findByIdMock = jest.spyOn(mockModel, 'findById');
			findByIdMock.mockResolvedValue(ReviewStub());

			const result = await reviewService.findOneByID(reviewId);

			expect(result).toEqual(ReviewStub());
			expect(findByIdMock).toHaveBeenCalledWith(reviewId);
		});
	});
});
