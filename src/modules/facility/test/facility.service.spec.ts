import { Test, TestingModule } from '@nestjs/testing';
import { FacilityService } from '../facility.service';
import { FacilityStub } from './stubs/facility.stub';
import { PhotoService } from 'src/modules/photo/photo.service';
import {
	Facility,
	ScheduleType,
	State,
	Status,
} from '../schemas/facility.schema';
import mongoose, { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { ReviewService } from 'src/modules/reviews/reviews.service';
import { FacilityScheduleService } from 'src/modules/facility-schedule/facility-schedule.service';
import { BrandService } from 'src/modules/brand/brand.service';
import { PackageTypeService } from 'src/modules/package-type/package-type.service';
import { PackageService } from 'src/modules/package/package.service';
import { HolidayService } from 'src/modules/holiday/holiday.service';
import { PromotionsService } from 'src/modules/promotions/promotions.service';
import { AttendanceService } from 'src/modules/attendance/attendance.service';
import { CreateFacilityDto, LocationDTO } from '../dto/create-facility-dto';
import { Photo } from 'src/modules/photo/schemas/photo.schema';
import { PhotoStub } from 'src/modules/photo/test/stubs/photo.stub';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { BrandStub } from 'src/modules/brand/test/stubs/brand.stub';
import { Brand } from 'src/modules/brand/schemas/brand.schema';
import { ScheduleStub } from 'src/modules/facility-schedule/test/stubs/facility-schedule.stub';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { UpdateFacilityDto } from '../dto/update-facility-dto';
import { CreateAddressDto } from 'src/modules/address/dto/create-address-dto';
import { CreateReviewDto } from 'src/modules/reviews/dto/create-review-dto';
import { appConfig } from 'src/app.config';
import { Review } from 'src/modules/reviews/schemas/reviews.schema';
import { ReviewStub } from 'src/modules/reviews/test/stubs/review.stub';

describe('FacilityService', function () {
	let facilityService: FacilityService;
	let facilityModel: Model<Facility>;
	let packageTypeService: PackageTypeService;
	let scheduleService: FacilityScheduleService;
	let holidayService: HolidayService;
	let attendanceService: AttendanceService;
	let photoService: PhotoService;
	let reviewService: ReviewService;
	let promotionService: PromotionsService;
	let brandService: BrandService;

	const saveMock = jest.fn().mockResolvedValue(FacilityStub());
	const createdFacilityMock = {
		...FacilityStub(),
		save: saveMock,
	};
	const mockModel = {
		create: jest.fn().mockReturnValue(createdFacilityMock),
		find: jest.fn(),
		findById: jest.fn(),
		findOneAndDelete: jest.fn(),
		findOneAndUpdate: jest.fn(),
		aggregate: jest.fn(),
	};

	const mockPackageTypeService = {
		findMany: jest.fn(),
	};

	const mockPackageService = {
		findMany: jest.fn(),
		findPackageWithLowestPrice: jest.fn(),
	};

	const mockScheduleService = {
		create: jest.fn().mockResolvedValue(ScheduleStub()),
	};

	const mockHolidayService = {
		findMany: jest.fn(),
	};

	const mockAttendanceService = {
		findMany: jest.fn(),
	};

	const mockPhotoService = {
		uploadManyFile: jest.fn().mockReturnValueOnce({
			items: [PhotoStub()],
			total: 1,
			options: {},
		} as ListResponse<Photo>),
		findMany: jest.fn(),
		delete: jest.fn(),
	};

	const mockReviewService = {
		findMany: jest.fn(),
		findOneByID: jest.fn(),
		create: jest.fn(),
		caculateAverageRating: jest.fn(),
		delete: jest.fn(),
		getReview: jest.fn(),
	};

	const mockPromotionService = {
		findMany: jest.fn(),
	};

	const mockBrandService = {
		findMany: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				FacilityService,
				{
					provide: HolidayService,
					useValue: mockHolidayService,
				},
				{
					provide: AttendanceService,
					useValue: mockAttendanceService,
				},
				{
					provide: PhotoService,
					useValue: mockPhotoService,
				},
				{
					provide: ReviewService,
					useValue: mockReviewService,
				},
				FacilityScheduleService,
				{
					provide: BrandService,
					useValue: mockBrandService,
				},
				{
					provide: PromotionsService,
					useValue: mockPromotionService,
				},
				{
					provide: FacilityScheduleService,
					useValue: mockScheduleService,
				},
				{
					provide: PackageTypeService,
					useValue: mockPackageTypeService,
				},
				{
					provide: PackageService,
					useValue: mockPackageService,
				},
				{
					provide: getModelToken(Facility.name),
					useValue: mockModel,
				},
			],
		}).compile();

		facilityService = module.get<FacilityService>(FacilityService);
		packageTypeService = module.get<PackageTypeService>(PackageTypeService);
		scheduleService = module.get<FacilityScheduleService>(
			FacilityScheduleService,
		);
		holidayService = module.get<HolidayService>(HolidayService);
		attendanceService = module.get<AttendanceService>(AttendanceService);
		photoService = module.get<PhotoService>(PhotoService);
		reviewService = module.get<ReviewService>(ReviewService);
		promotionService = module.get<PromotionsService>(PromotionsService);
		scheduleService = module.get<FacilityScheduleService>(
			FacilityScheduleService,
		);
		brandService = module.get<BrandService>(BrandService);
		facilityModel = module.get<Model<Facility>>(getModelToken(Facility.name));
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(facilityService).toBeDefined();
	});
	it('facilityModel should be defined', () => {
		expect(facilityModel).toBeDefined();
	});

	describe('create', () => {
		it('should create a new facility', async () => {
			const createFacilityDto: CreateFacilityDto = {
				brandID: '64944c7c2d7cf0ec0dbb4051',
				facilityCategoryID: ['649d3f7372e91c40d2e7e9dc'],
				name: 'California Fitness & Yoga Cần Thơ 3',
				address: {
					street: 'Vincom 209 đường 30/4',
					commune: 'Xuân Khánh',
					communeCode: '066',
					district: 'Ninh Kiều',
					districtCode: '067',
					province: 'Cần Thơ',
					provinceCode: '065',
				},
				location: { coordinates: [105.778274, 10.04407] },
				summary: 'Chất lượng là danh dự',
				description:
					"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
				state: State.ACTIVE,
				phone: '84906943567',
				scheduleDto: {
					type: ScheduleType.DAILY,
					openTime: [
						{
							shift: [
								{
									startTime: '06:01',
									endTime: '12:00',
								},
								{
									startTime: '13:00',
									endTime: '19:00',
								},
							],
						},
					],
				},
				photos: [],
				ownerID: '',
			};

			const req = {
				user: { sub: '6497c6807a114f5b35a393fd' },
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

			jest.spyOn(mockBrandService, 'findMany').mockResolvedValue({
				items: [BrandStub(), BrandStub()],
				total: 2,
				options: {},
			} as ListResponse<Brand>);

			const result = await facilityService.create(
				createFacilityDto,
				req,
				files,
			);

			expect(mockModel.create).toHaveBeenCalledWith(createFacilityDto);
			expect(mockBrandService.findMany).toHaveBeenCalledWith({
				_id: createFacilityDto.brandID,
				accountID: req.user.sub,
			});
			expect(mockScheduleService.create).toHaveBeenCalledWith(
				result._id,
				createFacilityDto.scheduleDto,
			);
			expect(mockPhotoService.uploadManyFile).toHaveBeenCalledWith(files, {
				ownerID: result._id,
			});
			expect(result).toEqual(FacilityStub());
		});

		it('should throw a ForbiddenException when not owner brand', async () => {
			const createFacilityDto: CreateFacilityDto = {
				brandID: '64944c7c2d7cf0ec0dbb4051',
				facilityCategoryID: ['649d3f7372e91c40d2e7e9dc'],
				name: 'California Fitness & Yoga Cần Thơ 3',
				address: {
					street: 'Vincom 209 đường 30/4',
					commune: 'Xuân Khánh',
					communeCode: '066',
					district: 'Ninh Kiều',
					districtCode: '067',
					province: 'Cần Thơ',
					provinceCode: '065',
				},
				location: { coordinates: [105.778274, 10.04407] },
				summary: 'Chất lượng là danh dự',
				description:
					"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
				state: State.ACTIVE,
				phone: '84906943567',
				scheduleDto: {
					type: ScheduleType.DAILY,
					openTime: [
						{
							shift: [
								{
									startTime: '06:01',
									endTime: '12:00',
								},
								{
									startTime: '13:00',
									endTime: '19:00',
								},
							],
						},
					],
				},
				photos: [],
				ownerID: '',
			};

			const req = {
				user: { sub: '6497c6807a114f5b35a393fd' },
			};

			jest.spyOn(mockBrandService, 'findMany').mockResolvedValue({
				items: [],
				total: 0,
				options: {},
			} as ListResponse<Brand>);

			await expect(
				facilityService.create(createFacilityDto, req),
			).rejects.toThrow(ForbiddenException);
		});
	});

	describe('update', () => {
		it('should throw BadRequestException if user is not the owner of the facility', async () => {
			jest.spyOn(facilityService, 'isOwnerFacility').mockResolvedValue(false);

			const id = 'facility-id';
			const updateFacilityDto: UpdateFacilityDto = {
				name: 'ABC',
				address: {} as CreateAddressDto,
				brandID: '123',
				description: '234',
				facilityCategoryID: '3423243423',
				location: {
					coordinates: [105.77827419395031, 10.044071865857335],
					type: 'Point',
				} as LocationDTO,
				schedule: 'sdfsdf',
				summary: 'sf',
				ownerID: 'sfsffdsf',
				state: State.ACTIVE,
			};
			const req = {
				user: { sub: 'user-id' },
			};

			await expect(
				facilityService.update(id, updateFacilityDto, req),
			).rejects.toThrow(ForbiddenException);
		});

		it('should update and return the facility if user is the owner', async () => {
			jest.spyOn(facilityService, 'isOwnerFacility').mockResolvedValue(true);

			const id = 'facility-id';
			const updateFacilityDto: UpdateFacilityDto = {
				name: 'ABC',
				address: {} as CreateAddressDto,
				brandID: '123',
				description: '234',
				facilityCategoryID: '3423243423',
				location: {
					coordinates: [105.77827419395031, 10.044071865857335],
					type: 'Point',
				} as LocationDTO,
				schedule: 'sdfsdf',
				summary: 'sf',
				ownerID: 'sfsffdsf',
				state: State.ACTIVE,
			};
			const req = {
				user: { sub: 'user-id' },
			};

			jest
				.spyOn(mockModel, 'findOneAndUpdate')
				.mockResolvedValue(FacilityStub());

			const result = await facilityService.update(id, updateFacilityDto, req);
			expect(result).toEqual(FacilityStub());
			expect(mockModel.findOneAndUpdate).toHaveBeenCalledWith(
				{ _id: id },
				updateFacilityDto,
				{ new: true },
			);
		});
	});

	describe('findMany', () => {
		it('should return a list of facilities based on the provided filter', async () => {
			const filter: ListOptions<Facility> = {
				sortField: 'createdAt',
				sortOrder: 'desc',
				limit: 10,
				offset: 0,
			};

			const mockResult = [FacilityStub(), FacilityStub()];
			jest.spyOn(mockModel, 'find').mockReturnValueOnce({
				sort: jest.fn().mockReturnThis(),
				skip: jest.fn().mockReturnThis(),
				limit: jest.fn().mockResolvedValueOnce(mockResult),
			} as any);

			const result = await facilityService.findMany(filter);

			expect(mockModel.find).toHaveBeenCalledWith(filter);
			expect(result.items).toEqual(mockResult);
			expect(result.total).toBe(mockResult.length);
			expect(result.options).toEqual(filter);
		});

		it('should return an empty list when no facilities match the filter', async () => {
			// Arrange
			const filter: ListOptions<Facility> = {
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

			const result = await facilityService.findMany(filter);

			expect(mockModel.find).toHaveBeenCalledWith(filter);
			expect(result.items).toEqual([]);
			expect(result.total).toBe(0);
			expect(result.options).toEqual(filter);
		});

		it('should handle errors and throw BadRequestException', async () => {
			const filter: ListOptions<Facility> = {
				sortField: 'createdAt',
				sortOrder: 'desc',
				limit: 10,
				offset: 0,
			};

			jest.spyOn(mockModel, 'find').mockImplementation(() => {
				throw new Error('An error occurred while retrieving facilities');
			});

			await expect(facilityService.findMany(filter)).rejects.toThrow(
				BadRequestException,
			);
		});
	});

	describe('getFacilities', () => {
		it('should return a list of facilities based on the provided filter', async () => {
			const filter: ListOptions<Facility> = {
				limit: 10,
				offset: 0,
				sortField: 'name',
				sortOrder: 'asc',
			};
			const mockFacilities = [
				{
					location: {
						coordinates: [105.77827419395032, 10.044071865857335],
						type: 'Point',
					},
					_id: '649d344f72e91c40d2e7e895',
					createdAt: '2023-06-29T07:35:43.345Z',
					updatedAt: '2023-07-20T03:15:21.860Z',
					brandID: {
						_id: '64944c7c2d7cf0ec0dbb4051',
						createdAt: '2023-07-19T04:24:00.502Z',
						updatedAt: '2023-07-19T04:24:00.502Z',
						name: 'TheHinhOnline 1',
						accountID: '649a9a4e631a79b49393bd7a',
					},
					facilityCategoryID: [
						{
							_id: '649d3f7372e91c40d2e7e9dc',
							createdAt: '2023-06-29T08:23:15.993Z',
							updatedAt: '2023-06-29T08:23:15.993Z',
							type: 'BOXING',
							name: 'BOXING',
							photo: {
								ownerID: '64a51c26ecf458661fbbff78',
								name: '1688542246151-209197963.png',
								imageURL:
									'https://cdn.discordapp.com/attachments/830416545594998844/1126074373636378734/boxing1_1.jpg',
								_id: '64b76560bc46a5407267f3cd',
								createdAt: '2023-07-19T04:24:00.569Z',
								updatedAt: '2023-07-19T04:24:00.569Z',
							},
							__v: 0,
						},
					],
					ownerID: '6497c6807a114f5b35a393fd',
					name: 'ABC - Á CHÂU',
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
					coordinates: [],
					state: null,
					status: 'APPROVED',
					phone: '84906943567',
					photos: [
						{
							createdAt: '2023-06-29T07:36:22.758Z',
							updatedAt: '2023-06-29T07:36:22.758Z',
							ownerID: '649d344f72e91c40d2e7e895',
							name: '1688024182737-366333986.jpeg',
							imageURL:
								'https://hdfitness.vn/wp-content/uploads/2022/02/tap-gym-la-gi-5-min-scaled.jpg',
							_id: '649d347672e91c40d2e7e89c',
							__v: 0,
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
							__v: 0,
						},
					],
					schedule: {
						_id: '64b4aff0f4f2b881b96475ea',
						createdAt: '2023-06-29T08:23:34.856Z',
						updatedAt: '2023-06-29T08:23:34.856Z',
						facilityID: '649d344f72e91c40d2e7e895',
						type: 'DAILY',
						openTime: [
							{
								shift: [
									{
										startTime: '06:00',
										endTime: '12:00',
									},
									{
										startTime: '13:00',
										endTime: '19:00',
									},
								],
							},
						],
					},
				},
			];

			jest.spyOn(mockModel, 'find').mockReturnValueOnce({
				sort: jest.fn().mockReturnThis(),
				skip: jest.fn().mockReturnThis(),
				limit: jest.fn().mockReturnThis(),
				populate: jest.fn().mockResolvedValueOnce(mockFacilities),
			} as any);
			const result = await facilityService.getFacilities(filter);

			expect(result.items).toEqual(mockFacilities);
			expect(result.total).toBe(mockFacilities.length);
			expect(result.options).toEqual(filter);
			expect(mockModel.find).toHaveBeenCalledWith({
				...filter,
				status: 'APPROVED',
			});
		});

		it('should return an empty list when no facilities match the filter', async () => {
			const filter: ListOptions<Facility> = {
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

			const result = await facilityService.findMany(filter);

			expect(mockModel.find).toHaveBeenCalledWith(filter);
			expect(result.items).toEqual([]);
			expect(result.total).toBe(0);
			expect(result.options).toEqual(filter);
		});

		it('should handle errors and throw BadRequestException', async () => {
			const filter: ListOptions<Facility> = {
				sortField: 'createdAt',
				sortOrder: 'desc',
				limit: 10,
				offset: 0,
			};

			jest.spyOn(mockModel, 'find').mockImplementation(() => {
				throw new Error('An error occurred while retrieving facilities');
			});

			await expect(facilityService.findMany(filter)).rejects.toThrow(
				BadRequestException,
			);
		});
	});

	describe('findOneByID', () => {
		it('should find a facility by ID', async () => {
			const facilityID = '649d344f72e91c40d2e7e895';

			const findByIdSpy = jest
				.spyOn(mockModel, 'findById')
				.mockReturnValueOnce(FacilityStub());

			const result = await facilityService.findOneByID(facilityID);

			expect(findByIdSpy).toHaveBeenCalledWith(facilityID);
			expect(result).toEqual(FacilityStub());
		});
	});

	describe('getOneByID', () => {
		it('should return a facility with the given ID', async () => {
			const facilityID = '649d344f72e91c40d2e7e895';
			const objectID = new mongoose.Types.ObjectId(facilityID);

			const mockFacility = {
				location: {
					coordinates: [105.77827419395032, 10.044071865857335],
					type: 'Point',
				},
				_id: '649d344f72e91c40d2e7e895',
				createdAt: '2023-06-29T07:35:43.345Z',
				updatedAt: '2023-07-20T03:15:21.860Z',
				brandID: {
					_id: '64944c7c2d7cf0ec0dbb4051',
					createdAt: '2023-07-19T04:24:00.502Z',
					updatedAt: '2023-07-19T04:24:00.502Z',
					name: 'TheHinhOnline 1',
					accountID: '649a9a4e631a79b49393bd7a',
				},
				facilityCategoryID: [
					{
						_id: '649d3f7372e91c40d2e7e9dc',
						createdAt: '2023-06-29T08:23:15.993Z',
						updatedAt: '2023-06-29T08:23:15.993Z',
						type: 'BOXING',
						name: 'BOXING',
						photo: {
							ownerID: '64a51c26ecf458661fbbff78',
							name: '1688542246151-209197963.png',
							imageURL:
								'https://cdn.discordapp.com/attachments/830416545594998844/1126074373636378734/boxing1_1.jpg',
							_id: '64b76560bc46a5407267f3cd',
							createdAt: '2023-07-19T04:24:00.569Z',
							updatedAt: '2023-07-19T04:24:00.569Z',
						},
						__v: 0,
					},
				],
				ownerID: '6497c6807a114f5b35a393fd',
				name: 'ABC - Á CHÂU',
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
				coordinates: [],
				state: null,
				status: 'APPROVED',
				phone: '84906943567',
				photos: [
					{
						createdAt: '2023-06-29T07:36:22.758Z',
						updatedAt: '2023-06-29T07:36:22.758Z',
						ownerID: '649d344f72e91c40d2e7e895',
						name: '1688024182737-366333986.jpeg',
						imageURL:
							'https://hdfitness.vn/wp-content/uploads/2022/02/tap-gym-la-gi-5-min-scaled.jpg',
						_id: '649d347672e91c40d2e7e89c',
						__v: 0,
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
						__v: 0,
					},
				],
				schedule: {
					_id: '64b4aff0f4f2b881b96475ea',
					createdAt: '2023-06-29T08:23:34.856Z',
					updatedAt: '2023-06-29T08:23:34.856Z',
					facilityID: '649d344f72e91c40d2e7e895',
					type: 'DAILY',
					openTime: [
						{
							shift: [
								{
									startTime: '06:00',
									endTime: '12:00',
								},
								{
									startTime: '13:00',
									endTime: '19:00',
								},
							],
						},
					],
				},
			} as unknown as Facility;

			jest.spyOn(mockModel, 'aggregate').mockResolvedValue([mockFacility]);
			const result = await facilityService.getOneByID(facilityID);

			expect(result).toEqual(mockFacility);
			expect(mockModel.aggregate).toHaveBeenCalledWith([
				{
					$match: { _id: objectID },
				},
				{
					$lookup: {
						from: 'facilitycategories',
						localField: 'facilityCategoryID',
						foreignField: '_id',
						as: 'facilityCategoryID',
					},
				},
				{
					$lookup: {
						from: 'facilityschedules',
						localField: 'schedule',
						foreignField: '_id',
						as: 'schedule',
					},
				},
				{ $unwind: '$schedule' },
				{
					$lookup: {
						from: 'brands',
						localField: 'brandID',
						foreignField: '_id',
						as: 'brandID',
					},
				},
				{ $unwind: '$brandID' },
				{
					$lookup: {
						from: 'packagetypes',
						let: { facID: '$_id' },
						pipeline: [
							{
								$match: {
									$expr: {
										$eq: ['$facilityID', '$$facID'],
									},
								},
							},
							{
								$lookup: {
									from: 'packages',
									localField: '_id',
									foreignField: 'packageTypeID',
									as: 'packages',
								},
							},
							// Add additional pipeline stages here if needed...
						],
						as: 'packageTypes',
					},
				},
			]);
		});

		it('should return empty when no facility is found', async () => {
			const facilityID = '649d344f72e91c40d2e7e895';
			const objectID = new mongoose.Types.ObjectId(facilityID);

			jest.spyOn(facilityModel, 'aggregate').mockResolvedValue([]);
			const result = await facilityService.getOneByID(facilityID);

			expect(result).toEqual(null);
			expect(mockModel.aggregate).toHaveBeenCalledWith([
				{
					$match: { _id: objectID },
				},
				{
					$lookup: {
						from: 'facilitycategories',
						localField: 'facilityCategoryID',
						foreignField: '_id',
						as: 'facilityCategoryID',
					},
				},
				{
					$lookup: {
						from: 'facilityschedules',
						localField: 'schedule',
						foreignField: '_id',
						as: 'schedule',
					},
				},
				{ $unwind: '$schedule' },
				{
					$lookup: {
						from: 'brands',
						localField: 'brandID',
						foreignField: '_id',
						as: 'brandID',
					},
				},
				{ $unwind: '$brandID' },
				{
					$lookup: {
						from: 'packagetypes',
						let: { facID: '$_id' },
						pipeline: [
							{
								$match: {
									$expr: {
										$eq: ['$facilityID', '$$facID'],
									},
								},
							},
							{
								$lookup: {
									from: 'packages',
									localField: '_id',
									foreignField: 'packageTypeID',
									as: 'packages',
								},
							},
						],
						as: 'packageTypes',
					},
				},
			]);
		});

		it('should throw BadRequest if error occurs', async () => {
			const facilityID = '649d344f72e91c40d2e7e895';
			jest.spyOn(facilityModel, 'aggregate').mockRejectedValue(new Error());
			await expect(facilityService.getOneByID(facilityID)).rejects.toThrow(
				new BadRequestException('An error occurred while retrieving facility'),
			);
		});
	});

	describe('addReview', () => {
		it('should add a review without files to a facility and update the average star', async () => {
			const facilityID = '649d344f72e91c40d2e7e895';
			const req = {
				user: { sub: '6497c6807a114f5b35a393fd' },
			};
			const reviewDto: CreateReviewDto = {
				accountID: null,
				facilityID: '649d344f72e91c40d2e7e895',
				rating: 5,
				comment: 'abc',
				photos: [],
			};
			const mockCreatedReview = {
				_id: '649d348d72e91c40d2e7e8b6',
				accountID: '649a8f8ab185ffb672485391',
				facilityID: '649d344f72e91c40d2e7e895',
				rating: 2,
				comment: 'ct7gxfhw8p8',
				photos: [],
				createdAt: new Date('2023-06-29T07:36:22.758Z'),
				updatedAt: new Date('2023-06-29T07:36:22.758Z'),
			};

			jest
				.spyOn(mockReviewService, 'create')
				.mockResolvedValue(mockCreatedReview);

			const mockAverageStar = 4.5;
			jest
				.spyOn(mockReviewService, 'caculateAverageRating')
				.mockResolvedValue(mockAverageStar);

			const result = await facilityService.addReview(
				facilityID,
				req,
				reviewDto,
			);

			expect(result).toEqual(FacilityStub());
			expect(mockReviewService.create).toHaveBeenCalledWith(
				req,
				reviewDto,
				null,
			);

			expect(mockReviewService.caculateAverageRating).toHaveBeenCalledWith(
				facilityID,
			);

			expect(mockModel.findOneAndUpdate).toHaveBeenCalledWith(
				{ _id: facilityID },
				{
					$push: {
						reviews: {
							$each: [mockCreatedReview],
							$slice: -appConfig.maxElementEmbedd,
						},
					},
					$set: {
						averageStar: mockAverageStar,
					},
				},
				{ new: true },
			);
		});

		it('should add a review with files to a facility and update the average star', async () => {
			const facilityID = '649d344f72e91c40d2e7e895';
			const req = {
				user: { sub: '6497c6807a114f5b35a393fd' },
			};
			const reviewDto: CreateReviewDto = {
				accountID: null,
				facilityID: '649d344f72e91c40d2e7e895',
				rating: 5,
				comment: 'abc',
				photos: [],
			};
			const mockCreatedReview = {
				_id: '649d348d72e91c40d2e7e8b6',
				accountID: '649a8f8ab185ffb672485391',
				facilityID: '649d344f72e91c40d2e7e895',
				rating: 2,
				comment: 'ct7gxfhw8p8',
				photos: [PhotoStub()],
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

			jest
				.spyOn(mockReviewService, 'create')
				.mockResolvedValue(mockCreatedReview);

			const mockAverageStar = undefined;
			jest
				.spyOn(mockReviewService, 'caculateAverageRating')
				.mockResolvedValue(mockAverageStar);

			const result = await facilityService.addReview(
				facilityID,
				req,
				reviewDto,
				files,
			);

			expect(result).toEqual(FacilityStub());
			expect(mockReviewService.create).toHaveBeenCalledWith(
				req,
				reviewDto,
				files,
			);

			expect(mockReviewService.caculateAverageRating).toHaveBeenCalledWith(
				facilityID,
			);

			expect(mockModel.findOneAndUpdate).toHaveBeenCalledWith(
				{ _id: facilityID },
				{
					$push: {
						reviews: {
							$each: [mockCreatedReview],
							$slice: -appConfig.maxElementEmbedd,
						},
					},
					$set: {
						averageStar: mockAverageStar,
					},
				},
				{ new: true },
			);
		});
	});

	describe('addPhoto', () => {
		it('should add photos to a facility', async () => {
			const facilityID = '649d344f72e91c40d2e7e895';
			const req = {
				user: { sub: '6497c6807a114f5b35a393fd' },
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
			const mockSortedPhotos = {
				items: [PhotoStub()],
				total: 1,
				options: {},
			} as ListResponse<Photo>;

			jest.spyOn(facilityService, 'isOwnerFacility').mockResolvedValue(true);
			jest.spyOn(mockPhotoService, 'uploadManyFile').mockResolvedValue({
				items: [PhotoStub()],
				total: 1,
				options: {},
			});
			jest
				.spyOn(mockPhotoService, 'findMany')
				.mockResolvedValue(mockSortedPhotos);
			jest.spyOn(mockModel, 'findById').mockResolvedValue({
				...FacilityStub(),
				save: jest.fn().mockResolvedValue(FacilityStub()),
			});

			const result = await facilityService.addPhoto(facilityID, req, files);

			expect(result).toEqual(FacilityStub());
			expect(facilityService.isOwnerFacility).toHaveBeenCalledWith(
				facilityID,
				req,
			);
			expect(mockPhotoService.uploadManyFile).toHaveBeenCalledWith(
				files,
				facilityID,
			);
			expect(mockPhotoService.findMany).toHaveBeenCalledWith({
				ownerID: facilityID,
				sortField: 'createdAt',
				sortOrder: 'desc',
				limit: parseInt(appConfig.maxElementEmbedd),
			});
			expect(mockModel.findById).toHaveBeenCalledWith(facilityID);
			expect(result.photos).toEqual(mockSortedPhotos.items);
		});

		it('should throw a BadRequestException if the user is not the owner of the facility', async () => {
			const facilityID = '649d344f72e91c40d2e7e895';
			const req = {
				user: { sub: '6497c6807a114f5b35a393fd' },
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

			jest.spyOn(facilityService, 'isOwnerFacility').mockResolvedValue(false);

			await expect(
				facilityService.addPhoto(facilityID, req, files),
			).rejects.toThrow(BadRequestException);
		});
	});

	describe('delete', () => {
		it('should delete a facility and its associated reviews and photos', async () => {
			const facilityID = '649d344f72e91c40d2e7e895';
			const req = {
				user: { sub: '6497c6807a114f5b35a393fd' },
			};

			jest.spyOn(facilityService, 'isOwnerFacility').mockResolvedValue(true);
			jest
				.spyOn(mockModel, 'findOneAndDelete')
				.mockResolvedValue(FacilityStub());

			const result = await facilityService.delete(facilityID, req);

			expect(result).toBe(true);
			expect(facilityService.isOwnerFacility).toHaveBeenCalledWith(
				facilityID,
				req,
			);
			expect(mockModel.findOneAndDelete).toHaveBeenCalledWith({
				_id: facilityID,
			});
			expect(mockReviewService.delete).toBeCalledTimes(
				FacilityStub().reviews.length,
			);
			expect(mockPhotoService.delete).toBeCalledTimes(
				FacilityStub().photos.length,
			);
		});

		it('should throw a BadRequestException if the user is not the owner of the facility', async () => {
			const facilityID = '649d344f72e91c40d2e7e895';
			const req = {
				user: { sub: '6497c6807a114f5b35a393fd' },
			};

			jest.spyOn(facilityService, 'isOwnerFacility').mockResolvedValue(false);
			await expect(facilityService.delete(facilityID, req)).rejects.toThrow(
				BadRequestException,
			);
		});

		it('should return false if the facility was not found', async () => {
			const facilityID = '649d344f72e91c40d2e7e895';
			const req = {
				user: { sub: '6497c6807a114f5b35a393fd' },
			};

			jest.spyOn(facilityService, 'isOwnerFacility').mockResolvedValue(true);
			jest.spyOn(mockModel, 'findOneAndDelete').mockResolvedValue(null);

			const result = await facilityService.delete(facilityID, req);

			expect(result).toBe(false);
			expect(facilityService.isOwnerFacility).toHaveBeenCalledWith(
				facilityID,
				req,
			);
			expect(mockModel.findOneAndDelete).toHaveBeenCalledWith({
				_id: facilityID,
			});
			expect(mockReviewService.delete).not.toHaveBeenCalled();
			expect(mockPhotoService.delete).not.toHaveBeenCalled();
		});
	});

	describe('deletePhoto', () => {
		it('should delete photos from the facility and the PhotoService', async () => {
			const facilityID = '649d344f72e91c40d2e7e895';
			const req = {
				user: { sub: '6497c6807a114f5b35a393fd' },
			};
			const listID = ['649d347672e91c40d2e7e89c', '649d347672e91c40d2e7e89b'];

			jest
				.spyOn(mockModel, 'findOneAndUpdate')
				.mockResolvedValue(FacilityStub());

			const result = await facilityService.deletePhoto(facilityID, req, listID);

			expect(result).toEqual(FacilityStub());
			expect(mockModel.findOneAndUpdate).toHaveBeenCalledWith(
				{ _id: facilityID, ownerID: req.user.sub },
				{ $pull: { photos: { _id: { $in: listID } } } },
				{ new: true },
			);
			expect(mockPhotoService.delete).toHaveBeenCalledTimes(listID.length);
		});

		it('should not delete photos if not owner of facility', async () => {
			const facilityID = '649d344f72e91c40d2e7e895';
			const req = {
				user: { sub: '6497c6807a114f5b35a393fd' },
			};
			const listID = ['649d347672e91c40d2e7e89c', '649d347672e91c40d2e7e89b'];

			jest.spyOn(mockModel, 'findOneAndUpdate').mockResolvedValue(undefined);

			await expect(
				facilityService.deletePhoto(facilityID, req, listID),
			).rejects.toThrow(ForbiddenException);
		});

		it('should not call PhotoService delete method if a photo ID is invalid', async () => {
			const facilityID = '649d344f72e91c40d2e7e895';
			const req = {
				user: { sub: '6497c6807a114f5b35a393fd' },
			};
			const listID = ['photo-id-1', 'invalid-photo-id'];

			jest
				.spyOn(mockModel, 'findOneAndUpdate')
				.mockResolvedValue(FacilityStub());

			const result = await facilityService.deletePhoto(facilityID, req, listID);

			expect(result).toEqual(FacilityStub());
			expect(mockModel.findOneAndUpdate).toHaveBeenCalledWith(
				{ _id: facilityID, ownerID: req.user.sub },
				{ $pull: { photos: { _id: { $in: listID } } } },
				{ new: true },
			);
			expect(mockPhotoService.delete).toHaveBeenCalledTimes(0);
		});
	});

	describe('deleteReviewByID', () => {
		it('should delete a review and update facility average star', async () => {
			const reviewID = '649d347672e91c40d2e7e89b';
			const facilityID = '649d344f72e91c40d2e7e895';
			const req = {
				user: {
					sub: '6497c6807a114f5b35a393fd',
					role: 'ADMIN',
				},
			};

			const mockReview: Review = {
				_id: reviewID,
				accountID: '6497c6807a114f5b35a393fd',
				facilityID: facilityID,
				rating: 5,
				comment: 'abc',
				photos: [],
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			const averageStar = 4.5;

			jest
				.spyOn(mockReviewService, 'findOneByID')
				.mockResolvedValue(mockReview);
			jest.spyOn(mockReviewService, 'delete').mockResolvedValue(mockReview);
			jest
				.spyOn(mockReviewService, 'caculateAverageRating')
				.mockResolvedValue(averageStar);
			jest
				.spyOn(mockModel, 'findOneAndUpdate')
				.mockResolvedValue(FacilityStub());

			const result = await facilityService.deleteReviewByID(req, reviewID);

			expect(result).toEqual(FacilityStub());
			expect(mockReviewService.findOneByID).toHaveBeenCalledWith(reviewID);
			expect(mockReviewService.delete).toHaveBeenCalledWith(reviewID);
			expect(mockReviewService.caculateAverageRating).toHaveBeenCalledWith(
				facilityID,
			);

			expect(mockModel.findOneAndUpdate).toHaveBeenCalledWith(
				{ _id: facilityID },
				{
					$pull: {
						reviews: {
							$and: [{ _id: reviewID }],
						},
					},
					$set: {
						averageStar: averageStar,
					},
				},
				{ new: true },
			);
		});

		it('should throw ForbiddenException if the user does not have permission to delete the review', async () => {
			const reviewID = '649d347672e91c40d2e7e89b';
			const req = {
				user: {
					sub: '6497c6807a114f5b35a393fd',
					role: 'MEMBER',
				},
			};

			const mockReview: Review = {
				_id: reviewID,
				accountID: 'user-id-1',
				facilityID: 'facility-id-1',
				rating: 5,
				comment: 'abc',
				photos: [],
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			jest
				.spyOn(mockReviewService, 'findOneByID')
				.mockResolvedValue(mockReview);

			await expect(
				facilityService.deleteReviewByID(req, reviewID),
			).rejects.toThrow(ForbiddenException);
		});
	});

	describe('findManyPhotos', () => {
		it('should return list photo with the correct parameters', async () => {
			const facilityID = 'facility-id-1';
			const filter: ListOptions<Photo> = {
				sortField: 'createdAt',
				sortOrder: 'desc',
				limit: 10,
				offset: 0,
			};

			const expectedResult: ListResponse<Photo> = {
				items: [PhotoStub(), PhotoStub()],
				total: 2,
				options: filter,
			};

			jest
				.spyOn(mockPhotoService, 'findMany')
				.mockResolvedValue(expectedResult);

			const result = await facilityService.findManyPhotos(facilityID, filter);

			expect(result).toEqual(expectedResult);
			expect(mockPhotoService.findMany).toHaveBeenCalledWith({
				...filter,
				ownerID: facilityID,
			});
		});
	});

	describe('findManyReviews', () => {
		it('should call FacilityModel.findById with the correct facilityID', async () => {
			const facilityID = 'facility-id-1';
			const filter: ListOptions<Review> = {
				sortField: 'createdAt',
				sortOrder: 'desc',
				limit: 10,
				offset: 0,
			};

			const mockReviewResult = [
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

			const mockExpectedResult: ListResponse<any> = {
				items: mockReviewResult,
				total: 2,
				options: filter,
			};

			jest.spyOn(mockModel, 'findById').mockResolvedValue(FacilityStub());
			jest
				.spyOn(mockReviewService, 'getReview')
				.mockResolvedValue(mockExpectedResult);

			const result = await facilityService.findManyReviews(facilityID, filter);

			expect(result).toEqual(mockExpectedResult);
			expect(mockModel.findById).toHaveBeenCalledWith(facilityID);
			expect(mockReviewService.getReview).toHaveBeenCalledWith(filter);
		});
	});

	describe('isOwnerFacility', () => {
		it('should return true if the user is the owner of the facility', async () => {
			const facilityID = '649d344f72e91c40d2e7e895';
			const req = {
				user: {
					sub: '6497c6807a114f5b35a393fd',
					role: 'ADMIN',
				},
			};

			jest.spyOn(mockModel, 'findById').mockResolvedValue(FacilityStub());

			const result = await facilityService.isOwnerFacility(facilityID, req);

			expect(result).toBe(true);
			expect(mockModel.findById).toHaveBeenCalledWith(facilityID);
		});

		it('should throw a BadRequestException if the facility does not exist', async () => {
			const facilityID = '649d344f72e91c40d2e7e895';
			const req = {
				user: {
					sub: '6497c6807a114f5b35a393ff',
					role: 'ADMIN',
				},
			};

			jest.spyOn(mockModel, 'findById').mockResolvedValue(null);

			await expect(
				facilityService.isOwnerFacility(facilityID, req),
			).rejects.toThrow(BadRequestException);
		});

		it('should return false if the user is not the owner of the facility', async () => {
			const facilityID = '649d344f72e91c40d2e7e895';
			const req = {
				user: {
					sub: '6497c6807a114f5b35a393ff',
					role: 'ADMIN',
				},
			};

			jest.spyOn(mockModel, 'findById').mockResolvedValue(FacilityStub());

			const result = await facilityService.isOwnerFacility(facilityID, req);

			expect(result).toBe(false);
			expect(mockModel.findById).toHaveBeenCalledWith(facilityID);
		});
	});

	describe('updateStatus', () => {
		it('should update the facility status if the user is an admin', async () => {
			const facilityID = '649d344f72e91c40d2e7e895';
			const req = {
				user: {
					sub: '6497c6807a114f5b35a393fd',
					role: 'ADMIN',
				},
			};
			const status = Status.APPROVED;

			jest
				.spyOn(mockModel, 'findOneAndUpdate')
				.mockResolvedValue(FacilityStub());

			const result = await facilityService.updateStatus(
				facilityID,
				req,
				status,
			);

			expect(result).toEqual(FacilityStub());
			expect(mockModel.findOneAndUpdate).toHaveBeenCalledWith(
				{ _id: facilityID },
				{ status: status },
				{ new: true },
			);
		});

		it('should throw ForbiddenException update the facility status if the user is not an admin', async () => {
			const facilityID = '649d344f72e91c40d2e7e895';
			const req = {
				user: {
					sub: '6497c6807a114f5b35a393fd',
					role: 'MEMBER',
				},
			};
			const status = Status.APPROVED;

			await expect(
				facilityService.updateStatus(facilityID, req, status),
			).rejects.toThrow();
			expect(mockModel.findOneAndUpdate).not.toHaveBeenCalled();
		});
	});

	describe('search', () => {
		it('should throw BadRequestException if coordinates are invalid', async () => {
			const filter = {
				latitude: '91',
				longitude: '180',
				limit: 10,
				offset: 0,
			};

			await expect(facilityService.search(filter)).rejects.toThrow(
				BadRequestException,
			);
		});

		it('should return facilities based on the provided search filter and sort by price', async () => {
			const filter = {
				search: 'facility name', // Search keyword
				sortField: 'price', // Sorting based on distance
				limit: 10,
				offset: 0,
				sortOrder: 'asc' as const,
			};

			const mockFacility = [
				{
					_id: '649d3a0d72e91c40d2e7e941',
					createdAt: '2023-06-29T08:00:13.372Z',
					updatedAt: '2023-06-29T08:00:45.561Z',
					brandID: {
						_id: '64944c7c2d7cf0ec0dbb4051',
						createdAt: '2023-07-21T03:03:13.891Z',
						updatedAt: '2023-07-21T03:03:13.891Z',
						name: 'TheHinhOnline 1',
						accountID: '649a9a4e631a79b49393bd7a',
						__v: 0,
					},
					facilityCategoryID: [
						{
							_id: '649d3f6972e91c40d2e7e9da',
							createdAt: '2023-06-29T08:23:05.455Z',
							updatedAt: '2023-06-29T08:23:05.455Z',
							type: 'YOGA',
							name: 'YOGA',
							photo: {
								ownerID: '64a51c26ecf458661fbbff78',
								name: '1688542246151-209197963.png',
								imageURL:
									'https://cdn.discordapp.com/attachments/830416545594998844/1126074372831072266/yoga1_1.jpg',
								_id: '64b9f571abc1193dd5635ed3',
								createdAt: '2023-07-21T03:03:13.941Z',
								updatedAt: '2023-07-21T03:03:13.941Z',
							},
							__v: 0,
						},
					],
					ownerID: '6497c6807a114f5b35a393fd',
					name: 'California Fitness & Yoga Cần Thơ',
					address: {
						street: 'Vincom 209 đường 30/4',
						commune: 'Xuân Khánh',
						communeCode: '066',
						district: 'Ninh Kiều',
						districtCode: '067',
						province: 'Cần Thơ',
						provinceCode: '065',
					},
					fullAddress: 'Xuân Khánh, Ninh Kiều, Cần Thơ',
					summary: 'Chất lượng là danh dự',
					description:
						"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
					coordinates: [],
					location: {
						coordinates: [105.77291088739058, 10.027851057940572],
						type: 'Point',
					},
					state: 'ACTIVE',
					status: 'APPROVED',
					phone: '842927302999',
					photos: [
						{
							createdAt: '2023-06-29T08:00:27.699Z',
							updatedAt: '2023-06-29T08:00:27.699Z',
							ownerID: '649d3a0d72e91c40d2e7e946',
							name: '1688025627677-173643808.jpeg',
							imageURL:
								'https://hdfitness.vn/wp-content/uploads/2023/04/an-khuya-khi-tap-gym-1-min-1-scaled.jpg',
							_id: '649d3a1b72e91c40d2e7e94d',
							__v: 0,
						},
					],
					reviews: [
						{
							accountID: '649a8f8ab185ffb672485391',
							facilityID: '649d3a0d72e91c40d2e7e946',
							rating: 4,
							comment: '807upxdg7pm',
							photos: [],
							_id: '649d3a2a72e91c40d2e7e95c',
							__v: 0,
						},
					],
					schedule: {
						_id: '64b0cd9f9fe7ffe0a6c20390',
						createdAt: '2023-06-29T08:23:34.856Z',
						updatedAt: '2023-06-29T08:23:34.856Z',
						facilityID: '649d3a0d72e91c40d2e7e946',
						type: 'WEEKLY',
						openTime: [
							{
								shift: [
									{
										startTime: '06:00',
										endTime: '12:00',
									},
									{
										startTime: '13:00',
										endTime: '19:00',
									},
								],
								dayOfWeek: 'MONDAY',
							},
							{
								shift: [
									{
										startTime: '06:00',
										endTime: '12:00',
									},
									{
										startTime: '13:00',
										endTime: '19:00',
									},
								],
								dayOfWeek: 'TUESDAY',
							},
							{
								shift: [
									{
										startTime: '06:00',
										endTime: '12:00',
									},
									{
										startTime: '13:00',
										endTime: '19:00',
									},
								],
								dayOfWeek: 'WEDNESDAY',
							},
							{
								shift: [
									{
										startTime: '06:00',
										endTime: '12:00',
									},
									{
										startTime: '13:00',
										endTime: '19:00',
									},
								],
								dayOfWeek: 'THURSDAY',
							},
							{
								shift: [
									{
										startTime: '06:00',
										endTime: '12:00',
									},
									{
										startTime: '13:00',
										endTime: '19:00',
									},
								],
								dayOfWeek: 'FRIDAY',
							},
						],
						__v: 0,
					},
					__v: 0,
					distance: 0,
				},
				{
					_id: '649d3a0d72e91c40d2e7e942',
					createdAt: '2023-06-29T08:00:13.372Z',
					updatedAt: '2023-06-29T08:00:45.561Z',
					brandID: {
						_id: '64944c7c2d7cf0ec0dbb4051',
						createdAt: '2023-07-21T03:03:13.891Z',
						updatedAt: '2023-07-21T03:03:13.891Z',
						name: 'TheHinhOnline 1',
						accountID: '649a9a4e631a79b49393bd7a',
						__v: 0,
					},
					facilityCategoryID: [
						{
							_id: '649d3f6972e91c40d2e7e9da',
							createdAt: '2023-06-29T08:23:05.455Z',
							updatedAt: '2023-06-29T08:23:05.455Z',
							type: 'YOGA',
							name: 'YOGA',
							photo: {
								ownerID: '64a51c26ecf458661fbbff78',
								name: '1688542246151-209197963.png',
								imageURL:
									'https://cdn.discordapp.com/attachments/830416545594998844/1126074372831072266/yoga1_1.jpg',
								_id: '64b9f571abc1193dd5635ed3',
								createdAt: '2023-07-21T03:03:13.941Z',
								updatedAt: '2023-07-21T03:03:13.941Z',
							},
							__v: 0,
						},
					],
					ownerID: '6497c6807a114f5b35a393fd',
					name: 'California Fitness & Yoga Cần Thơ',
					address: {
						street: 'Vincom 209 đường 30/4',
						commune: 'Xuân Khánh',
						communeCode: '066',
						district: 'Ninh Kiều',
						districtCode: '067',
						province: 'Cần Thơ',
						provinceCode: '065',
					},
					fullAddress: 'Xuân Khánh, Ninh Kiều, Cần Thơ',
					summary: 'Chất lượng là danh dự',
					description:
						"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
					coordinates: [],
					location: {
						coordinates: [105.77291088739058, 10.027851057940572],
						type: 'Point',
					},
					state: 'ACTIVE',
					status: 'APPROVED',
					phone: '842927302999',
					photos: [
						{
							createdAt: '2023-06-29T08:00:27.699Z',
							updatedAt: '2023-06-29T08:00:27.699Z',
							ownerID: '649d3a0d72e91c40d2e7e946',
							name: '1688025627677-173643808.jpeg',
							imageURL:
								'https://hdfitness.vn/wp-content/uploads/2023/04/an-khuya-khi-tap-gym-1-min-1-scaled.jpg',
							_id: '649d3a1b72e91c40d2e7e94d',
							__v: 0,
						},
					],
					reviews: [
						{
							accountID: '649a8f8ab185ffb672485391',
							facilityID: '649d3a0d72e91c40d2e7e946',
							rating: 4,
							comment: '807upxdg7pm',
							photos: [],
							_id: '649d3a2a72e91c40d2e7e95c',
							__v: 0,
						},
					],
					schedule: {
						_id: '64b0cd9f9fe7ffe0a6c20390',
						createdAt: '2023-06-29T08:23:34.856Z',
						updatedAt: '2023-06-29T08:23:34.856Z',
						facilityID: '649d3a0d72e91c40d2e7e946',
						type: 'WEEKLY',
						openTime: [
							{
								shift: [
									{
										startTime: '06:00',
										endTime: '12:00',
									},
									{
										startTime: '13:00',
										endTime: '19:00',
									},
								],
								dayOfWeek: 'MONDAY',
							},
							{
								shift: [
									{
										startTime: '06:00',
										endTime: '12:00',
									},
									{
										startTime: '13:00',
										endTime: '19:00',
									},
								],
								dayOfWeek: 'TUESDAY',
							},
							{
								shift: [
									{
										startTime: '06:00',
										endTime: '12:00',
									},
									{
										startTime: '13:00',
										endTime: '19:00',
									},
								],
								dayOfWeek: 'WEDNESDAY',
							},
							{
								shift: [
									{
										startTime: '06:00',
										endTime: '12:00',
									},
									{
										startTime: '13:00',
										endTime: '19:00',
									},
								],
								dayOfWeek: 'THURSDAY',
							},
							{
								shift: [
									{
										startTime: '06:00',
										endTime: '12:00',
									},
									{
										startTime: '13:00',
										endTime: '19:00',
									},
								],
								dayOfWeek: 'FRIDAY',
							},
						],
						__v: 0,
					},
					__v: 0,
					distance: 0,
				},
			];

			const mockPackages = [
				{
					_id: '649dd2e7e895344f72e91c86',
					packageTypeID: '6476ef7d1f0419cd330fe691',
					facilityID: '649d3a0d72e91c40d2e7e941',
					type: '1',
					price: 150000,
					benefits: ['Use of bathroom'],
					__v: 0,
					createdAt: '2023-07-21T03:03:14.000Z',
					updatedAt: '2023-07-21T03:03:14.000Z',
				},
				{
					_id: '649dd2e7e895344f72e91c86',
					packageTypeID: '6476ef7d1f0419cd330fe691',
					facilityID: '649d3a0d72e91c40d2e7e942',
					type: '1',
					price: 130000,
					benefits: ['Use of bathroom'],
					__v: 0,
					createdAt: '2023-07-21T03:03:14.000Z',
					updatedAt: '2023-07-21T03:03:14.000Z',
				},
			];

			jest.spyOn(mockModel, 'aggregate').mockResolvedValue([...mockFacility]);
			jest
				.spyOn(mockPackageService, 'findPackageWithLowestPrice')
				.mockImplementation((facilityID) => {
					if (facilityID == '649d3a0d72e91c40d2e7e941') {
						return mockPackages[0];
					} else if (facilityID == '649d3a0d72e91c40d2e7e942') {
						return mockPackages[1];
					}
				});

			const result = await facilityService.search(filter);

			//Lưu ý thứ tự equal vì hiện tại đang test kết quả trả về sắp theo giá
			expect(result.items).toEqual([
				{ ...mockFacility[1], package: { ...mockPackages[1] } },
				{ ...mockFacility[0], package: { ...mockPackages[0] } },
			]);
		});

		it('should return facilities based on the provided search filter and sort by distance', async () => {
			const filter = {
				search: 'facility name', // Search keyword
				sortField: 'price', // Sorting based on distance
				latitude: 80,
				longitude: 80,
				limit: 10,
				offset: 1,
				sortOrder: null,
			};

			const mockFacility = [
				{
					_id: '649d3a0d72e91c40d2e7e941',
					createdAt: '2023-06-29T08:00:13.372Z',
					updatedAt: '2023-06-29T08:00:45.561Z',
					brandID: {
						_id: '64944c7c2d7cf0ec0dbb4051',
						createdAt: '2023-07-21T03:03:13.891Z',
						updatedAt: '2023-07-21T03:03:13.891Z',
						name: 'TheHinhOnline 1',
						accountID: '649a9a4e631a79b49393bd7a',
						__v: 0,
					},
					facilityCategoryID: [
						{
							_id: '649d3f6972e91c40d2e7e9da',
							createdAt: '2023-06-29T08:23:05.455Z',
							updatedAt: '2023-06-29T08:23:05.455Z',
							type: 'YOGA',
							name: 'YOGA',
							photo: {
								ownerID: '64a51c26ecf458661fbbff78',
								name: '1688542246151-209197963.png',
								imageURL:
									'https://cdn.discordapp.com/attachments/830416545594998844/1126074372831072266/yoga1_1.jpg',
								_id: '64b9f571abc1193dd5635ed3',
								createdAt: '2023-07-21T03:03:13.941Z',
								updatedAt: '2023-07-21T03:03:13.941Z',
							},
							__v: 0,
						},
					],
					ownerID: '6497c6807a114f5b35a393fd',
					name: 'California Fitness & Yoga Cần Thơ',
					address: {
						street: 'Vincom 209 đường 30/4',
						commune: 'Xuân Khánh',
						communeCode: '066',
						district: 'Ninh Kiều',
						districtCode: '067',
						province: 'Cần Thơ',
						provinceCode: '065',
					},
					fullAddress: 'Xuân Khánh, Ninh Kiều, Cần Thơ',
					summary: 'Chất lượng là danh dự',
					description:
						"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
					coordinates: [],
					location: {
						coordinates: [105.77291088739058, 10.027851057940572],
						type: 'Point',
					},
					state: 'ACTIVE',
					status: 'APPROVED',
					phone: '842927302999',
					photos: [
						{
							createdAt: '2023-06-29T08:00:27.699Z',
							updatedAt: '2023-06-29T08:00:27.699Z',
							ownerID: '649d3a0d72e91c40d2e7e946',
							name: '1688025627677-173643808.jpeg',
							imageURL:
								'https://hdfitness.vn/wp-content/uploads/2023/04/an-khuya-khi-tap-gym-1-min-1-scaled.jpg',
							_id: '649d3a1b72e91c40d2e7e94d',
							__v: 0,
						},
					],
					reviews: [
						{
							accountID: '649a8f8ab185ffb672485391',
							facilityID: '649d3a0d72e91c40d2e7e946',
							rating: 4,
							comment: '807upxdg7pm',
							photos: [],
							_id: '649d3a2a72e91c40d2e7e95c',
							__v: 0,
						},
					],
					schedule: {
						_id: '64b0cd9f9fe7ffe0a6c20390',
						createdAt: '2023-06-29T08:23:34.856Z',
						updatedAt: '2023-06-29T08:23:34.856Z',
						facilityID: '649d3a0d72e91c40d2e7e946',
						type: 'WEEKLY',
						openTime: [
							{
								shift: [
									{
										startTime: '06:00',
										endTime: '12:00',
									},
									{
										startTime: '13:00',
										endTime: '19:00',
									},
								],
								dayOfWeek: 'MONDAY',
							},
							{
								shift: [
									{
										startTime: '06:00',
										endTime: '12:00',
									},
									{
										startTime: '13:00',
										endTime: '19:00',
									},
								],
								dayOfWeek: 'TUESDAY',
							},
							{
								shift: [
									{
										startTime: '06:00',
										endTime: '12:00',
									},
									{
										startTime: '13:00',
										endTime: '19:00',
									},
								],
								dayOfWeek: 'WEDNESDAY',
							},
							{
								shift: [
									{
										startTime: '06:00',
										endTime: '12:00',
									},
									{
										startTime: '13:00',
										endTime: '19:00',
									},
								],
								dayOfWeek: 'THURSDAY',
							},
							{
								shift: [
									{
										startTime: '06:00',
										endTime: '12:00',
									},
									{
										startTime: '13:00',
										endTime: '19:00',
									},
								],
								dayOfWeek: 'FRIDAY',
							},
						],
						__v: 0,
					},
					__v: 0,
					distance: 10,
				},
				{
					_id: '649d3a0d72e91c40d2e7e942',
					createdAt: '2023-06-29T08:00:13.372Z',
					updatedAt: '2023-06-29T08:00:45.561Z',
					brandID: {
						_id: '64944c7c2d7cf0ec0dbb4051',
						createdAt: '2023-07-21T03:03:13.891Z',
						updatedAt: '2023-07-21T03:03:13.891Z',
						name: 'TheHinhOnline 1',
						accountID: '649a9a4e631a79b49393bd7a',
						__v: 0,
					},
					facilityCategoryID: [
						{
							_id: '649d3f6972e91c40d2e7e9da',
							createdAt: '2023-06-29T08:23:05.455Z',
							updatedAt: '2023-06-29T08:23:05.455Z',
							type: 'YOGA',
							name: 'YOGA',
							photo: {
								ownerID: '64a51c26ecf458661fbbff78',
								name: '1688542246151-209197963.png',
								imageURL:
									'https://cdn.discordapp.com/attachments/830416545594998844/1126074372831072266/yoga1_1.jpg',
								_id: '64b9f571abc1193dd5635ed3',
								createdAt: '2023-07-21T03:03:13.941Z',
								updatedAt: '2023-07-21T03:03:13.941Z',
							},
							__v: 0,
						},
					],
					ownerID: '6497c6807a114f5b35a393fd',
					name: 'California Fitness & Yoga Cần Thơ',
					address: {
						street: 'Vincom 209 đường 30/4',
						commune: 'Xuân Khánh',
						communeCode: '066',
						district: 'Ninh Kiều',
						districtCode: '067',
						province: 'Cần Thơ',
						provinceCode: '065',
					},
					fullAddress: 'Xuân Khánh, Ninh Kiều, Cần Thơ',
					summary: 'Chất lượng là danh dự',
					description:
						"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
					coordinates: [],
					location: {
						coordinates: [105.77291088739058, 10.027851057940572],
						type: 'Point',
					},
					state: 'ACTIVE',
					status: 'APPROVED',
					phone: '842927302999',
					photos: [
						{
							createdAt: '2023-06-29T08:00:27.699Z',
							updatedAt: '2023-06-29T08:00:27.699Z',
							ownerID: '649d3a0d72e91c40d2e7e946',
							name: '1688025627677-173643808.jpeg',
							imageURL:
								'https://hdfitness.vn/wp-content/uploads/2023/04/an-khuya-khi-tap-gym-1-min-1-scaled.jpg',
							_id: '649d3a1b72e91c40d2e7e94d',
							__v: 0,
						},
					],
					reviews: [
						{
							accountID: '649a8f8ab185ffb672485391',
							facilityID: '649d3a0d72e91c40d2e7e946',
							rating: 4,
							comment: '807upxdg7pm',
							photos: [],
							_id: '649d3a2a72e91c40d2e7e95c',
							__v: 0,
						},
					],
					schedule: {
						_id: '64b0cd9f9fe7ffe0a6c20390',
						createdAt: '2023-06-29T08:23:34.856Z',
						updatedAt: '2023-06-29T08:23:34.856Z',
						facilityID: '649d3a0d72e91c40d2e7e946',
						type: 'WEEKLY',
						openTime: [
							{
								shift: [
									{
										startTime: '06:00',
										endTime: '12:00',
									},
									{
										startTime: '13:00',
										endTime: '19:00',
									},
								],
								dayOfWeek: 'MONDAY',
							},
							{
								shift: [
									{
										startTime: '06:00',
										endTime: '12:00',
									},
									{
										startTime: '13:00',
										endTime: '19:00',
									},
								],
								dayOfWeek: 'TUESDAY',
							},
							{
								shift: [
									{
										startTime: '06:00',
										endTime: '12:00',
									},
									{
										startTime: '13:00',
										endTime: '19:00',
									},
								],
								dayOfWeek: 'WEDNESDAY',
							},
							{
								shift: [
									{
										startTime: '06:00',
										endTime: '12:00',
									},
									{
										startTime: '13:00',
										endTime: '19:00',
									},
								],
								dayOfWeek: 'THURSDAY',
							},
							{
								shift: [
									{
										startTime: '06:00',
										endTime: '12:00',
									},
									{
										startTime: '13:00',
										endTime: '19:00',
									},
								],
								dayOfWeek: 'FRIDAY',
							},
						],
						__v: 0,
					},
					__v: 0,
					distance: 5,
				},
			];

			const mockPackages = [
				{
					_id: '649dd2e7e895344f72e91c86',
					packageTypeID: '6476ef7d1f0419cd330fe691',
					facilityID: '649d3a0d72e91c40d2e7e941',
					type: '1',
					price: 150000,
					benefits: ['Use of bathroom'],
					__v: 0,
					createdAt: '2023-07-21T03:03:14.000Z',
					updatedAt: '2023-07-21T03:03:14.000Z',
				},
				{
					_id: '649dd2e7e895344f72e91c86',
					packageTypeID: '6476ef7d1f0419cd330fe691',
					facilityID: '649d3a0d72e91c40d2e7e942',
					type: '1',
					price: 130000,
					benefits: ['Use of bathroom'],
					__v: 0,
					createdAt: '2023-07-21T03:03:14.000Z',
					updatedAt: '2023-07-21T03:03:14.000Z',
				},
			];

			jest.spyOn(mockModel, 'aggregate').mockResolvedValue([...mockFacility]);
			jest
				.spyOn(mockPackageService, 'findPackageWithLowestPrice')
				.mockImplementation((facilityID) => {
					if (facilityID == '649d3a0d72e91c40d2e7e941') {
						return mockPackages[0];
					} else if (facilityID == '649d3a0d72e91c40d2e7e942') {
						return mockPackages[1];
					}
				});

			const result = await facilityService.search(filter);

			//Lưu ý thứ tự equal vì hiện tại đang test kết quả trả về sắp theo distance
			//offset là 1 nên chỉ có 1 pt trả về
			expect(result.items).toEqual([
				{ ...mockFacility[0], package: { ...mockPackages[0] } },
			]);
			expect(result.total).toEqual(1);
			expect(result.options).toEqual(filter);
		});
	});

	describe('getNearestFacilities', () => {
		it('should return list of nearest facilities', async () => {
			const longitude = 10.1234;
			const latitude = 20.5678;
			const mockFacilities = [
				{
					_id: '649d3a0d72e91c40d2e7e941',
					createdAt: '2023-06-29T08:00:13.372Z',
					updatedAt: '2023-06-29T08:00:45.561Z',
					brandID: {
						_id: '64944c7c2d7cf0ec0dbb4051',
						createdAt: '2023-07-21T03:03:13.891Z',
						updatedAt: '2023-07-21T03:03:13.891Z',
						name: 'TheHinhOnline 1',
						accountID: '649a9a4e631a79b49393bd7a',
						__v: 0,
					},
					facilityCategoryID: [
						{
							_id: '649d3f6972e91c40d2e7e9da',
							createdAt: '2023-06-29T08:23:05.455Z',
							updatedAt: '2023-06-29T08:23:05.455Z',
							type: 'YOGA',
							name: 'YOGA',
							photo: {
								ownerID: '64a51c26ecf458661fbbff78',
								name: '1688542246151-209197963.png',
								imageURL:
									'https://cdn.discordapp.com/attachments/830416545594998844/1126074372831072266/yoga1_1.jpg',
								_id: '64b9f571abc1193dd5635ed3',
								createdAt: '2023-07-21T03:03:13.941Z',
								updatedAt: '2023-07-21T03:03:13.941Z',
							},
							__v: 0,
						},
					],
					ownerID: '6497c6807a114f5b35a393fd',
					name: 'California Fitness & Yoga Cần Thơ',
					address: {
						street: 'Vincom 209 đường 30/4',
						commune: 'Xuân Khánh',
						communeCode: '066',
						district: 'Ninh Kiều',
						districtCode: '067',
						province: 'Cần Thơ',
						provinceCode: '065',
					},
					fullAddress: 'Xuân Khánh, Ninh Kiều, Cần Thơ',
					summary: 'Chất lượng là danh dự',
					description:
						"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
					coordinates: [],
					location: {
						coordinates: [105.77291088739058, 10.027851057940572],
						type: 'Point',
					},
					state: 'ACTIVE',
					status: 'APPROVED',
					phone: '842927302999',
					photos: [
						{
							createdAt: '2023-06-29T08:00:27.699Z',
							updatedAt: '2023-06-29T08:00:27.699Z',
							ownerID: '649d3a0d72e91c40d2e7e946',
							name: '1688025627677-173643808.jpeg',
							imageURL:
								'https://hdfitness.vn/wp-content/uploads/2023/04/an-khuya-khi-tap-gym-1-min-1-scaled.jpg',
							_id: '649d3a1b72e91c40d2e7e94d',
							__v: 0,
						},
					],
					reviews: [
						{
							accountID: '649a8f8ab185ffb672485391',
							facilityID: '649d3a0d72e91c40d2e7e946',
							rating: 4,
							comment: '807upxdg7pm',
							photos: [],
							_id: '649d3a2a72e91c40d2e7e95c',
							__v: 0,
						},
					],
					schedule: {
						_id: '64b0cd9f9fe7ffe0a6c20390',
						createdAt: '2023-06-29T08:23:34.856Z',
						updatedAt: '2023-06-29T08:23:34.856Z',
						facilityID: '649d3a0d72e91c40d2e7e946',
						type: 'WEEKLY',
						openTime: [
							{
								shift: [
									{
										startTime: '06:00',
										endTime: '12:00',
									},
									{
										startTime: '13:00',
										endTime: '19:00',
									},
								],
								dayOfWeek: 'MONDAY',
							},
							{
								shift: [
									{
										startTime: '06:00',
										endTime: '12:00',
									},
									{
										startTime: '13:00',
										endTime: '19:00',
									},
								],
								dayOfWeek: 'TUESDAY',
							},
							{
								shift: [
									{
										startTime: '06:00',
										endTime: '12:00',
									},
									{
										startTime: '13:00',
										endTime: '19:00',
									},
								],
								dayOfWeek: 'WEDNESDAY',
							},
							{
								shift: [
									{
										startTime: '06:00',
										endTime: '12:00',
									},
									{
										startTime: '13:00',
										endTime: '19:00',
									},
								],
								dayOfWeek: 'THURSDAY',
							},
							{
								shift: [
									{
										startTime: '06:00',
										endTime: '12:00',
									},
									{
										startTime: '13:00',
										endTime: '19:00',
									},
								],
								dayOfWeek: 'FRIDAY',
							},
						],
						__v: 0,
					},
					__v: 0,
					distance: 0,
				},
			];
			const mockPackages = [
				{
					_id: '649dd2e7e895344f72e91c86',
					packageTypeID: '6476ef7d1f0419cd330fe691',
					facilityID: '649d3a0d72e91c40d2e7e941',
					type: '1',
					price: 150000,
					benefits: ['Use of bathroom'],
					__v: 0,
					createdAt: '2023-07-21T03:03:14.000Z',
					updatedAt: '2023-07-21T03:03:14.000Z',
				},
			];

			jest.spyOn(mockModel, 'aggregate').mockResolvedValue(mockFacilities);
			jest
				.spyOn(mockPackageService, 'findPackageWithLowestPrice')
				.mockResolvedValue(mockPackages[0]);

			const result = await facilityService.getNearestFacilities(
				longitude,
				latitude,
			);

			expect(result.items).toEqual([
				{ ...mockFacilities[0], package: mockPackages[0] },
			]);
			expect(result.total).toBe(mockFacilities.length);
			expect(
				mockPackageService.findPackageWithLowestPrice,
			).toHaveBeenCalledTimes(mockFacilities.length);
		});

		it('should throw BadRequestException when invalid coordinates are provided', async () => {
			const longitude = NaN;
			const latitude = 20.5678;

			await expect(
				facilityService.getNearestFacilities(longitude, latitude),
			).rejects.toThrow(BadRequestException);
		});
	});
});
