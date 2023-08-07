import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	Query,
	Req,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiResponse,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateFacilityDto, LocationDTO } from './dto/create-facility-dto';
import {
	Facility,
	ScheduleType,
	State,
	Status,
} from './schemas/facility.schema';
import {
	ErrorResponse,
	ListOptions,
	ListResponse,
} from 'src/shared/response/common-response';
import { Review } from '../reviews/schemas/reviews.schema';
import { UpdateFacilityDto } from './dto/update-facility-dto';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import { Photo } from '../photo/schemas/photo.schema';
import { ShiftTime } from '../facility-schedule/entities/shift-time.entity';
import { OpenTime } from '../facility-schedule/entities/open-time.entity';
import { FacilitySchedule } from '../facility-schedule/entities/facility-schedule.entity';
import { Holiday } from '../holiday/entities/holiday.entity';
import { PackageType } from '../package-type/entities/package-type.entity';
import { ShiftTimeDto } from '../facility-schedule/dto/shift-time-dto';
import { OpenTimeDto } from '../facility-schedule/dto/open-time-dto';
import { dayOfWeek } from '../facility-schedule/entities/open-time.entity';
import { HolidayDto } from '../holiday/dto/holiday-dto';
import { CreatePackageTypeDto } from '../package-type/dto/create-package-type-dto';
import { UpdateOrderDto } from '../package-type/dto/update-order-dto';
import { DeletePhotoOfFacilityDto } from './dto/delete-photo-facility';
// import { FacilityService } from './facility.service';
import { CreateReviewDto } from '../reviews/dto/create-review-dto';
import { FacilityService } from './facility.service';
import { DeleteReviewOfFacilityDto } from './dto/delete-review-facility';
import { Public } from '../auth/decorators/public.decorator';
import { OwnershipFacilityGuard } from 'src/guards/ownership/ownership-facility.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { User, UserRole } from '../users/schemas/user.schema';
import { Attendance } from '../attendance/entities/attendance.entity';
import { UpdateStatusFacilityDto } from './dto/update-status-facility';
import { CreatePromotionDto } from '../promotions/dto/create-promotion-dto';
import {
	CustomerType,
	Promotion,
	PromotionMethod,
	PromotionStatus,
	PromotionType,
} from '../promotions/schemas/promotion.schema';
import { UpdatePromotionDto } from '../promotions/dto/update-promotion-dto';
import { FacilityScheduleDto } from '../facility-schedule/dto/facility-schedule-dto';

@ApiTags('facilities')
@Controller('facilities')
export class FacilityController {
	constructor(private readonly facilityService: FacilityService) {}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get many facility with many fields',
	})
	@ApiDocsPagination('Facility')
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: '1233456',
						brandID: {},
						facilityCategoryID: {},
						ownerID: {},
						name: 'City gym',
						address: {
							street: '30/4',
							commune: 'Phường Xuân Khánh',
							communeCode: '011',
							district: 'Quận Ninh Kiều',
							districtCode: '056',
							province: 'Thành phố Cần Thơ',
							provinceCode: '065',
						},
						summary: 'Phòng gym thân thiện',
						description: 'Nhiều dụng cụ tập luyện',
						location: { coordinates: [10.031966330522316, 105.76892820319247] },
						state: State.ACTIVE,
						status: Status.APPROVED,
						averageStar: null,
						photos: [
							{
								_id: '123456789',
								ownerID: 'id-bucket',
								name: 'name-image',
								imageURL: 'http://localhost:8080/id-bucket/name-image',
								createdAt: new Date(),
								updatedAt: new Date(),
							},
						],
						reviews: [
							{
								_id: '123456789',
								accountID: {},
								facilityID: {},
								comment: 'Đáng để trải nghiệm',
								rating: 5,
								photos: [
									{
										_id: '12345678dsgdgsdxdg4',
										ownerID: 'bucket1',
										name: 'image-name',
										imageURL: 'http://localhost:8080/bucket1/image-name',
										createdAt: new Date(),
										updatedAt: new Date(),
									},
								] as Photo[],
								createdAt: new Date(),
								updatedAt: new Date(),
							},
						],
						schedule: '64b0cd9f9fe7ffe0a6c2038f',
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				],
				total: 1,
				options: {
					limit: 1,
					offet: 1,
					search: 'string',
					sortBy: 'createdAt',
					sortOrder: 'asc',
				} as ListOptions<Facility>,
			} as ListResponse<Facility>,
		},
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Facility not found!',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid',
	})
	async getManyFacility(@Query() filter: ListOptions<Facility>) {
		return await this.facilityService.getFacilities(filter);
	}

	@Public()
	@Get('search')
	@ApiOperation({
		summary: 'search facility by address và location',
	})
	@ApiQuery({
		name: 'longitude',
		type: Number,
		required: false,
		example: 105.77291088739058,
	})
	@ApiQuery({
		name: 'latitude',
		type: Number,
		required: false,
		example: 10.027851057940572,
	})
	@ApiQuery({
		name: 'search',
		type: String,
		required: false,
		example: 'cần thơ',
	})
	@ApiQuery({
		name: 'sortOrder',
		type: String,
		required: false,
		example: 'asc',
	})
	@ApiQuery({
		name: 'sortField',
		type: String,
		required: false,
		example: 'distance',
	})
	@ApiQuery({
		name: 'limit',
		type: Number,
		required: false,
		example: 10,
	})
	@ApiQuery({
		name: 'offset',
		type: Number,
		required: false,
		example: 0,
	})
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: '649d344f72e91c40d2e7e895',
						createdAt: '2023-06-29T07:35:43.345Z',
						updatedAt: '2023-06-29T07:36:49.766Z',
						brandID: {
							_id: '64944c7c2d7cf0ec0dbb4051',
							createdAt: '2023-07-27T02:48:05.999Z',
							updatedAt: '2023-07-27T02:48:05.999Z',
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
									_id: '64c1dae6d9724ff5f0bbdcaa',
									createdAt: '2023-07-27T02:48:06.052Z',
									updatedAt: '2023-07-27T02:48:06.052Z',
								},
								__v: 0,
							},
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
									_id: '64c1dae6d9724ff5f0bbdcb0',
									createdAt: '2023-07-27T02:48:06.052Z',
									updatedAt: '2023-07-27T02:48:06.052Z',
								},
								__v: 0,
							},
							{
								_id: '649d3f7b72e91c40d2e7e9de',
								createdAt: '2023-06-29T08:23:23.661Z',
								updatedAt: '2023-06-29T08:23:23.661Z',
								type: 'GYM',
								name: 'GYM',
								photo: {
									ownerID: '64a51c26ecf458661fbbff78',
									name: '1688542246151-209197963.png',
									imageURL:
										'https://cdn.discordapp.com/attachments/830416545594998844/1126074372461961227/gym1_1.jpg',
									_id: '64c1dae6d9724ff5f0bbdcae',
									createdAt: '2023-07-27T02:48:06.052Z',
									updatedAt: '2023-07-27T02:48:06.052Z',
								},
								__v: 0,
							},
							{
								_id: '649d3f8672e91c40d2e7e9e0',
								createdAt: '2023-06-29T08:23:34.856Z',
								updatedAt: '2023-06-29T08:23:34.856Z',
								type: 'CYCLING',
								name: 'CYCLING',
								photo: {
									ownerID: '64a51c26ecf458661fbbff78',
									name: '1688542246151-209197963.png',
									imageURL:
										'https://cdn.discordapp.com/attachments/830416545594998844/1126074373095305296/cycling1_1.jpg',
									_id: '64c1dae6d9724ff5f0bbdcac',
									createdAt: '2023-07-27T02:48:06.052Z',
									updatedAt: '2023-07-27T02:48:06.052Z',
								},
								__v: 0,
							},
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
						coordinates: [],
						location: {
							coordinates: [105.77827419395031, 10.044071865857335],
							type: 'Point',
						},
						state: 'ACTIVE',
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
							{
								createdAt: '2023-06-29T07:36:22.758Z',
								updatedAt: '2023-06-29T07:36:22.758Z',
								ownerID: '649d344f72e91c40d2e7e895',
								name: '1688024182746-73042410.png',
								imageURL:
									'https://hdfitness.vn/wp-content/uploads/2022/02/Fitness-4-scaled-1536x1024.jpg',
								_id: '649d347672e91c40d2e7e89d',
								__v: 0,
							},
							{
								createdAt: '2023-06-29T07:36:22.758Z',
								updatedAt: '2023-06-29T07:36:22.758Z',
								ownerID: '649d344f72e91c40d2e7e895',
								name: '1688024182724-411896153.png',
								imageURL:
									'https://hdfitness.vn/wp-content/uploads/2022/03/cac-bai-tap-chan-cho-nam-1-min-1024x684.jpg',
								_id: '649d347672e91c40d2e7e89b',
								__v: 0,
							},
							{
								createdAt: '2023-06-29T07:36:22.758Z',
								updatedAt: '2023-06-29T07:36:22.758Z',
								ownerID: '649d344f72e91c40d2e7e895',
								name: '1688024182696-205093289.png',
								imageURL:
									'https://hdfitness.vn/wp-content/uploads/2022/03/thay-doi-nho-tap-gym-7-min-1024x683.jpg',
								_id: '649d347672e91c40d2e7e899',
								__v: 0,
							},
							{
								createdAt: '2023-06-29T07:36:22.758Z',
								updatedAt: '2023-06-29T07:36:22.758Z',
								ownerID: '649d344f72e91c40d2e7e895',
								name: '1688024182709-1336106.png',
								imageURL:
									'https://hdfitness.vn/wp-content/uploads/2022/03/thay-doi-nho-tap-gym-2-min-1024x683.jpg',
								_id: '649d347672e91c40d2e7e89a',
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
							{
								accountID: '649a8f8ab185ffb672485391',
								facilityID: '649d344f72e91c40d2e7e895',
								rating: 5,
								comment: '46bcpb2u40p',
								photos: [],
								_id: '649d348e72e91c40d2e7e8c2',
								__v: 0,
							},
							{
								accountID: '649a8f8ab185ffb672485391',
								facilityID: '649d344f72e91c40d2e7e895',
								rating: 1,
								comment: '79ipdfwknm2',
								photos: [],
								_id: '649d348f72e91c40d2e7e8cf',
								__v: 0,
							},
							{
								accountID: '649a8f8ab185ffb672485391',
								facilityID: '649d344f72e91c40d2e7e895',
								rating: 2,
								comment: 'zwk0nwwjr8',
								photos: [],
								_id: '649d349072e91c40d2e7e8dd',
								__v: 0,
							},
							{
								accountID: '649a8f8ab185ffb672485391',
								facilityID: '649d344f72e91c40d2e7e895',
								rating: 2,
								comment: '5tb52o4jreg',
								photos: [],
								_id: '649d349172e91c40d2e7e8ec',
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
							__v: 0,
						},
						__v: 0,
						distance: 1898.977173018055,
						package: [
							{
								_id: '649dd2e7e895344f72e91c46',
								packageTypeID: '6476ef7d1f0419cd330fe682',
								facilityID: '649d344f72e91c40d2e7e895',
								type: '1',
								price: 150000,
								benefits: ['Use of bathroom'],
								__v: 0,
								createdAt: '2023-07-27T02:48:06.091Z',
								updatedAt: '2023-07-27T02:48:06.091Z',
							},
						],
					},
				],
				total: 1,
				options: {} as ListOptions<any>,
			} as ListResponse<any>,
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: 'You have to provide lacation',
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Not found facilities',
	})
	search(@Query() filter: ListOptions<Facility>) {
		return this.facilityService.search(filter);
	}

	@Public()
	@Get('nearby')
	@ApiOperation({
		summary: 'Find the nearest facilites',
	})
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				total: 1,
				items: [
					{
						_id: '649d344f72e91c40d2e7e895',
						createdAt: '2023-06-29T07:35:43.345Z',
						updatedAt: '2023-06-29T07:36:49.766Z',
						brandID: {
							_id: '64944c7c2d7cf0ec0dbb4051',
							createdAt: '2023-07-27T02:48:05.999Z',
							updatedAt: '2023-07-27T02:48:05.999Z',
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
									_id: '64c1dae6d9724ff5f0bbdcaa',
									createdAt: '2023-07-27T02:48:06.052Z',
									updatedAt: '2023-07-27T02:48:06.052Z',
								},
								__v: 0,
							},
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
									_id: '64c1dae6d9724ff5f0bbdcb0',
									createdAt: '2023-07-27T02:48:06.052Z',
									updatedAt: '2023-07-27T02:48:06.052Z',
								},
								__v: 0,
							},
							{
								_id: '649d3f7b72e91c40d2e7e9de',
								createdAt: '2023-06-29T08:23:23.661Z',
								updatedAt: '2023-06-29T08:23:23.661Z',
								type: 'GYM',
								name: 'GYM',
								photo: {
									ownerID: '64a51c26ecf458661fbbff78',
									name: '1688542246151-209197963.png',
									imageURL:
										'https://cdn.discordapp.com/attachments/830416545594998844/1126074372461961227/gym1_1.jpg',
									_id: '64c1dae6d9724ff5f0bbdcae',
									createdAt: '2023-07-27T02:48:06.052Z',
									updatedAt: '2023-07-27T02:48:06.052Z',
								},
								__v: 0,
							},
							{
								_id: '649d3f8672e91c40d2e7e9e0',
								createdAt: '2023-06-29T08:23:34.856Z',
								updatedAt: '2023-06-29T08:23:34.856Z',
								type: 'CYCLING',
								name: 'CYCLING',
								photo: {
									ownerID: '64a51c26ecf458661fbbff78',
									name: '1688542246151-209197963.png',
									imageURL:
										'https://cdn.discordapp.com/attachments/830416545594998844/1126074373095305296/cycling1_1.jpg',
									_id: '64c1dae6d9724ff5f0bbdcac',
									createdAt: '2023-07-27T02:48:06.052Z',
									updatedAt: '2023-07-27T02:48:06.052Z',
								},
								__v: 0,
							},
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
						coordinates: [],
						location: {
							coordinates: [105.77827419395031, 10.044071865857335],
							type: 'Point',
						},
						state: 'ACTIVE',
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
							{
								createdAt: '2023-06-29T07:36:22.758Z',
								updatedAt: '2023-06-29T07:36:22.758Z',
								ownerID: '649d344f72e91c40d2e7e895',
								name: '1688024182746-73042410.png',
								imageURL:
									'https://hdfitness.vn/wp-content/uploads/2022/02/Fitness-4-scaled-1536x1024.jpg',
								_id: '649d347672e91c40d2e7e89d',
								__v: 0,
							},
							{
								createdAt: '2023-06-29T07:36:22.758Z',
								updatedAt: '2023-06-29T07:36:22.758Z',
								ownerID: '649d344f72e91c40d2e7e895',
								name: '1688024182724-411896153.png',
								imageURL:
									'https://hdfitness.vn/wp-content/uploads/2022/03/cac-bai-tap-chan-cho-nam-1-min-1024x684.jpg',
								_id: '649d347672e91c40d2e7e89b',
								__v: 0,
							},
							{
								createdAt: '2023-06-29T07:36:22.758Z',
								updatedAt: '2023-06-29T07:36:22.758Z',
								ownerID: '649d344f72e91c40d2e7e895',
								name: '1688024182696-205093289.png',
								imageURL:
									'https://hdfitness.vn/wp-content/uploads/2022/03/thay-doi-nho-tap-gym-7-min-1024x683.jpg',
								_id: '649d347672e91c40d2e7e899',
								__v: 0,
							},
							{
								createdAt: '2023-06-29T07:36:22.758Z',
								updatedAt: '2023-06-29T07:36:22.758Z',
								ownerID: '649d344f72e91c40d2e7e895',
								name: '1688024182709-1336106.png',
								imageURL:
									'https://hdfitness.vn/wp-content/uploads/2022/03/thay-doi-nho-tap-gym-2-min-1024x683.jpg',
								_id: '649d347672e91c40d2e7e89a',
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
							{
								accountID: '649a8f8ab185ffb672485391',
								facilityID: '649d344f72e91c40d2e7e895',
								rating: 5,
								comment: '46bcpb2u40p',
								photos: [],
								_id: '649d348e72e91c40d2e7e8c2',
								__v: 0,
							},
							{
								accountID: '649a8f8ab185ffb672485391',
								facilityID: '649d344f72e91c40d2e7e895',
								rating: 1,
								comment: '79ipdfwknm2',
								photos: [],
								_id: '649d348f72e91c40d2e7e8cf',
								__v: 0,
							},
							{
								accountID: '649a8f8ab185ffb672485391',
								facilityID: '649d344f72e91c40d2e7e895',
								rating: 2,
								comment: 'zwk0nwwjr8',
								photos: [],
								_id: '649d349072e91c40d2e7e8dd',
								__v: 0,
							},
							{
								accountID: '649a8f8ab185ffb672485391',
								facilityID: '649d344f72e91c40d2e7e895',
								rating: 2,
								comment: '5tb52o4jreg',
								photos: [],
								_id: '649d349172e91c40d2e7e8ec',
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
							__v: 0,
						},
						distance: 1898.977173018055,
						package: [
							{
								_id: '649dd2e7e895344f72e91c46',
								packageTypeID: '6476ef7d1f0419cd330fe682',
								facilityID: '649d344f72e91c40d2e7e895',
								type: '1',
								price: 150000,
								benefits: ['Use of bathroom'],
								__v: 0,
								createdAt: '2023-07-27T02:48:06.091Z',
								updatedAt: '2023-07-27T02:48:06.091Z',
							},
						],
					},
				],
				options: {
					limit: 1,
					offet: 1,
					search: 'string',
					sortBy: 'averageStar',
					sortOrder: 'asc',
				} as ListOptions<Facility>,
			} as unknown as ListResponse<Facility>,
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid',
	})
	@ApiQuery({
		name: 'longitude',
		type: Number,
		required: true,
		example: '105.77291088739058',
	})
	@ApiQuery({
		name: 'latitude',
		type: Number,
		required: true,
		example: '10.027851057940572',
	})
	getFacilityByLocation(
		@Query('longitude') longitude: number,
		@Query('latitude') latitude: number,
	) {
		if (longitude === undefined || latitude === undefined) {
			throw new BadRequestException('Both longitude and latitude are required');
		}
		return this.facilityService.getNearestFacilities(longitude, latitude);
	}

	@Get('count')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Get number facility of owner',
	})
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					total: 1,
					items: [
						{
							_id: '123456789',
							ownerID: 'id-bucket',
							name: 'name-image',
							imageURL: 'http://localhost:8080/id-bucket/name-image',
							createdAt: new Date(),
							updatedAt: new Date(),
						},
					],
					options: {
						limit: 1,
						offset: 1,
						searchField: 'ownerID',
						searchValue: 'id-bucket',
						sortField: 'createdAt',
						sortOrder: 'asc',
					} as ListOptions<Photo>,
				} as ListResponse<Photo>,
			},
		},
	})
	getNumberFacilityOfOwner(@Req() req: any) {
		return this.facilityService.getNumberFacilityOfOwner(req);
	}

	@Public()
	@Get(':facilityID')
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiOperation({
		summary: 'Get facility by id',
	})
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				data: {
					_id: '649d344f72e91c40d2e7e895',
					createdAt: '2023-06-29T07:35:43.345Z',
					updatedAt: '2023-06-29T07:36:49.766Z',
					brandID: {
						_id: '64944c7c2d7cf0ec0dbb4051',
						createdAt: '2023-07-27T02:48:05.999Z',
						updatedAt: '2023-07-27T02:48:05.999Z',
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
								_id: '64c1dae6d9724ff5f0bbdcaa',
								createdAt: '2023-07-27T02:48:06.052Z',
								updatedAt: '2023-07-27T02:48:06.052Z',
							},
							__v: 0,
						},
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
								_id: '64c1dae6d9724ff5f0bbdcb0',
								createdAt: '2023-07-27T02:48:06.052Z',
								updatedAt: '2023-07-27T02:48:06.052Z',
							},
							__v: 0,
						},
						{
							_id: '649d3f7b72e91c40d2e7e9de',
							createdAt: '2023-06-29T08:23:23.661Z',
							updatedAt: '2023-06-29T08:23:23.661Z',
							type: 'GYM',
							name: 'GYM',
							photo: {
								ownerID: '64a51c26ecf458661fbbff78',
								name: '1688542246151-209197963.png',
								imageURL:
									'https://cdn.discordapp.com/attachments/830416545594998844/1126074372461961227/gym1_1.jpg',
								_id: '64c1dae6d9724ff5f0bbdcae',
								createdAt: '2023-07-27T02:48:06.052Z',
								updatedAt: '2023-07-27T02:48:06.052Z',
							},
							__v: 0,
						},
						{
							_id: '649d3f8672e91c40d2e7e9e0',
							createdAt: '2023-06-29T08:23:34.856Z',
							updatedAt: '2023-06-29T08:23:34.856Z',
							type: 'CYCLING',
							name: 'CYCLING',
							photo: {
								ownerID: '64a51c26ecf458661fbbff78',
								name: '1688542246151-209197963.png',
								imageURL:
									'https://cdn.discordapp.com/attachments/830416545594998844/1126074373095305296/cycling1_1.jpg',
								_id: '64c1dae6d9724ff5f0bbdcac',
								createdAt: '2023-07-27T02:48:06.052Z',
								updatedAt: '2023-07-27T02:48:06.052Z',
							},
							__v: 0,
						},
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
					coordinates: [],
					location: {
						coordinates: [105.77827419395031, 10.044071865857335],
						type: 'Point',
					},
					state: 'ACTIVE',
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
						{
							createdAt: '2023-06-29T07:36:22.758Z',
							updatedAt: '2023-06-29T07:36:22.758Z',
							ownerID: '649d344f72e91c40d2e7e895',
							name: '1688024182746-73042410.png',
							imageURL:
								'https://hdfitness.vn/wp-content/uploads/2022/02/Fitness-4-scaled-1536x1024.jpg',
							_id: '649d347672e91c40d2e7e89d',
							__v: 0,
						},
						{
							createdAt: '2023-06-29T07:36:22.758Z',
							updatedAt: '2023-06-29T07:36:22.758Z',
							ownerID: '649d344f72e91c40d2e7e895',
							name: '1688024182724-411896153.png',
							imageURL:
								'https://hdfitness.vn/wp-content/uploads/2022/03/cac-bai-tap-chan-cho-nam-1-min-1024x684.jpg',
							_id: '649d347672e91c40d2e7e89b',
							__v: 0,
						},
						{
							createdAt: '2023-06-29T07:36:22.758Z',
							updatedAt: '2023-06-29T07:36:22.758Z',
							ownerID: '649d344f72e91c40d2e7e895',
							name: '1688024182696-205093289.png',
							imageURL:
								'https://hdfitness.vn/wp-content/uploads/2022/03/thay-doi-nho-tap-gym-7-min-1024x683.jpg',
							_id: '649d347672e91c40d2e7e899',
							__v: 0,
						},
						{
							createdAt: '2023-06-29T07:36:22.758Z',
							updatedAt: '2023-06-29T07:36:22.758Z',
							ownerID: '649d344f72e91c40d2e7e895',
							name: '1688024182709-1336106.png',
							imageURL:
								'https://hdfitness.vn/wp-content/uploads/2022/03/thay-doi-nho-tap-gym-2-min-1024x683.jpg',
							_id: '649d347672e91c40d2e7e89a',
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
						{
							accountID: '649a8f8ab185ffb672485391',
							facilityID: '649d344f72e91c40d2e7e895',
							rating: 5,
							comment: '46bcpb2u40p',
							photos: [],
							_id: '649d348e72e91c40d2e7e8c2',
							__v: 0,
						},
						{
							accountID: '649a8f8ab185ffb672485391',
							facilityID: '649d344f72e91c40d2e7e895',
							rating: 1,
							comment: '79ipdfwknm2',
							photos: [],
							_id: '649d348f72e91c40d2e7e8cf',
							__v: 0,
						},
						{
							accountID: '649a8f8ab185ffb672485391',
							facilityID: '649d344f72e91c40d2e7e895',
							rating: 2,
							comment: 'zwk0nwwjr8',
							photos: [],
							_id: '649d349072e91c40d2e7e8dd',
							__v: 0,
						},
						{
							accountID: '649a8f8ab185ffb672485391',
							facilityID: '649d344f72e91c40d2e7e895',
							rating: 2,
							comment: '5tb52o4jreg',
							photos: [],
							_id: '649d349172e91c40d2e7e8ec',
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
						__v: 0,
					},
					__v: 0,
					distance: 1898.977173018055,
					package: [
						{
							_id: '649dd2e7e895344f72e91c46',
							packageTypeID: '6476ef7d1f0419cd330fe682',
							facilityID: '649d344f72e91c40d2e7e895',
							type: '1',
							price: 150000,
							benefits: ['Use of bathroom'],
							__v: 0,
							createdAt: '2023-07-27T02:48:06.091Z',
							updatedAt: '2023-07-27T02:48:06.091Z',
						},
					],
				},
			},
		} as unknown as Facility,
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Facility not found!',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid',
	})
	async getFacilityById(@Param('facilityID') facilityID) {
		return await this.facilityService.getOneByID(facilityID);
	}

	@Public()
	@Get(':facilityID/reviews')
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiOperation({
		summary: 'Get review of facility by facilityID',
	})
	@ApiDocsPagination('Review')
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					total: 1,
					items: [
						{
							_id: '123456789',
							accountID: {},
							facilityID: {},
							comment: 'Đáng để trải nghiệm',
							rating: 5,
							photos: [
								{
									_id: '12345678dsgdgsdxdg4',
									ownerID: 'bucket1',
									name: 'image-name',
									imageURL: 'http://localhost:8080/bucket1/image-name',
									createdAt: new Date(),
									updatedAt: new Date(),
								},
							] as Photo[],
							createdAt: new Date(),
							updatedAt: new Date(),
						},
					],
					options: {
						limit: 1,
						offet: 1,
						search: 'string',
						sortBy: 'createdAt',
						sortOrder: 'asc',
					} as ListOptions<Review>,
				} as ListResponse<Review>,
			},
		},
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Facility not found!',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid',
	})
	getReviewFacility(
		@Param('facilityID') facilityID,
		@Query() filter: ListOptions<Review>,
	) {
		return this.facilityService.findManyReviews(facilityID, filter);
	}

	@Public()
	@Get(':facilityID/photos')
	@ApiParam({ name: 'facilityID', type: String, description: 'id facility' })
	@ApiOperation({
		summary: 'Get photos of facility',
	})
	@ApiDocsPagination('Photo')
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					total: 1,
					items: [
						{
							_id: '123456789',
							ownerID: 'id-bucket',
							name: 'name-image',
							imageURL: 'http://localhost:8080/id-bucket/name-image',
							createdAt: new Date(),
							updatedAt: new Date(),
						},
					],
					options: {
						limit: 1,
						offset: 1,
						searchField: 'ownerID',
						searchValue: 'id-bucket',
						sortField: 'createdAt',
						sortOrder: 'asc',
					} as ListOptions<Photo>,
				} as ListResponse<Photo>,
			},
		},
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Photo not found!',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid',
	})
	getPhotoFacility(
		@Param('facilityID') facilityID: string,
		@Query() filter: ListOptions<Photo>,
	) {
		return this.facilityService.findManyPhotos(facilityID, filter);
		// return this.pho;
	}

	// ATTENDANCE
	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.MEMBER)
	@Get(':facilityID/attendance')
	@ApiOperation({
		summary: 'Get Attendance by facilityId of User',
		description: `Member can use this API`,
	})
	@ApiParam({
		name: 'facilityID',
		type: String,
		description: 'Facility ID',
	})
	@ApiOkResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				facilityID: {} as unknown as Facility,
				accountID: {} as unknown as User,
				date: [],
				createdAt: new Date(),
				updatedAt: new Date(),
			} as Attendance,
		},
	})
	@ApiBadRequestResponse({
		schema: {
			example: {
				code: '400',
				message: '[Input] invalid!',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	async getAttendancesByFacility(
		@Param('facilityID') facilityID: string,
		@Req() req: any,
	) {
		return await this.facilityService.getAttendance(facilityID, req.user.sub);
	}

	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.MEMBER)
	@Post(':facilityID/attendance')
	@ApiOperation({
		summary: 'Create Attendance by facilityId of User',
		description: `Member can use this API`,
	})
	@ApiParam({
		name: 'facilityID',
		type: String,
		description: 'Facility ID',
	})
	@ApiOkResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				facilityID: {} as unknown as Facility,
				accountID: {} as unknown as User,
				date: [],
				createdAt: new Date(),
				updatedAt: new Date(),
			} as Attendance,
		},
	})
	@ApiUnauthorizedResponse({
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiForbiddenResponse({
		schema: {
			example: {
				code: '403',
				message: 'Forbidden resource',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	async createAttendanceByFacility(
		@Param('facilityID') facilityID: string,
		@Req() req: any,
	) {
		return await this.facilityService.createAttendance(
			facilityID,
			req.user.sub,
		);
	}

	//SCHEDULE
	@ApiBearerAuth()
	@UseGuards(OwnershipFacilityGuard)
	@Get(':facilityID/schedules')
	@ApiOperation({
		summary: 'Get All Schedule by facilityID',
		description: `Only Owner can use this API`,
	})
	@ApiParam({
		name: 'facilityID',
		type: String,
		description: 'Facility ID',
	})
	@ApiOkResponse({
		schema: {
			example: {
				items: [
					{
						_id: '6476ef7d1f0419cd330fe128',
						facilityID: {} as unknown as Facility,
						type: ScheduleType.DAILY,
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
								] as ShiftTime[],
							},
						] as OpenTime[],
						createdAt: new Date(),
						updatedAt: new Date(),
					} as FacilitySchedule,
				],
				total: 1,
				options: {
					limit: 10,
					offset: 0,
					searchField: 'facilityID',
					searchValue: 'string',
					sortField: 'type',
					sortOrder: 'asc',
				} as ListOptions<FacilitySchedule>,
			} as ListResponse<FacilitySchedule>,
		},
	})
	@ApiNotFoundResponse({
		schema: {
			example: {
				code: '404',
				message: 'Facility not found!',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiBadRequestResponse({
		schema: {
			example: {
				code: '400',
				message: '[Input] invalid!',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiUnauthorizedResponse({
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiForbiddenResponse({
		schema: {
			example: {
				code: '403',
				message: 'Forbidden resource',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	getAllSchedulesByFacility(@Param('facilityID') facilityID: string) {
		return this.facilityService.findAllSchedules(facilityID);
	}

	// @Public()
	// @Get(':facilityID/schedules/current')
	// @ApiOperation({
	// 	summary: 'Get Current Schedule by facilityID',
	// 	description: `All role can use this API`,
	// })
	// @ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	// @ApiOkResponse({
	// 	schema: {
	// 		example: {
	// 			_id: '6476ef7d1f0419cd330fe128',
	// 			facilityID: {} as unknown as Facility,
	// 			type: ScheduleType.DAILY,
	// 			openTime: [
	// 				{
	// 					shift: [
	// 						{
	// 							startTime: '06:00',
	// 							endTime: '12:00',
	// 						},
	// 						{
	// 							startTime: '13:00',
	// 							endTime: '19:00',
	// 						},
	// 					] as ShiftTime[],
	// 				},
	// 			] as OpenTime[],
	// 			createdAt: new Date(),
	// 			updatedAt: new Date(),
	// 		} as FacilitySchedule,
	// 	},
	// })
	// @ApiNotFoundResponse({
	// 	schema: {
	// 		example: {
	// 			code: '404',
	// 			message: 'Facility not found!',
	// 			details: null,
	// 		} as ErrorResponse<null>,
	// 	},
	// })
	// @ApiBadRequestResponse({
	// 	schema: {
	// 		example: {
	// 			code: '400',
	// 			message: '[Input] invalid!',
	// 			details: null,
	// 		} as ErrorResponse<null>,
	// 	},
	// })
	// async getCurrentScheduleByFacility(@Param('facilityID') facilityID: string) {
	// 	return this.facilityService.getCurrentSchedule(facilityID);
	// }

	@ApiBearerAuth()
	@UseGuards(OwnershipFacilityGuard)
	@Post(':facilityID/schedules')
	@ApiOperation({
		summary: 'Create new Schedule by facilityID',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({
		name: 'facilityID',
		type: String,
		description: 'Facility ID',
	})
	@ApiBody({
		type: FacilityScheduleDto,
		examples: {
			Daily: {
				value: {
					type: ScheduleType.DAILY,
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
							] as ShiftTimeDto[],
						},
					] as OpenTimeDto[],
				} as FacilityScheduleDto,
			},
			Weekly: {
				value: {
					type: ScheduleType.WEEKLY,
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
							] as ShiftTimeDto[],
							dayOfWeek: dayOfWeek.MONDAY,
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
							] as ShiftTimeDto[],
							dayOfWeek: dayOfWeek.TUESDAY,
						},
					] as OpenTimeDto[],
				} as FacilityScheduleDto,
			},
			Monthly: {
				value: {
					type: ScheduleType.MONTHLY,
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
							] as ShiftTimeDto[],
							dayOfMonth: 1,
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
							] as ShiftTimeDto[],
							dayOfMonth: 2,
						},
					] as OpenTimeDto[],
				} as FacilityScheduleDto,
			},
		},
	})
	@ApiCreatedResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				facilityID: {} as unknown as Facility,
				type: ScheduleType.DAILY,
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
						] as ShiftTime[],
					} as OpenTime,
				],
				createdAt: new Date(),
				updatedAt: new Date(),
			} as FacilitySchedule,
		},
	})
	@ApiUnauthorizedResponse({
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiForbiddenResponse({
		schema: {
			example: {
				code: '403',
				message: 'Forbidden resource',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiBadRequestResponse({
		schema: {
			example: {
				code: '400',
				message: '[Input] invalid!',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	async createScheduleByFacility(
		@Param('facilityID') facilityID: string,
		@Body() data: FacilityScheduleDto,
	) {
		return await this.facilityService.createSchedule(facilityID, data);
	}

	@Public()
	@Get(':facilityID/holidays')
	@ApiDocsPagination('holiday')
	@ApiOperation({
		summary: 'Get All Holidays by facilityID',
		description: `All role can use this API`,
	})
	@ApiQuery({
		name: 'startDate',
		type: String,
		required: false,
		description: 'startDate',
	})
	@ApiQuery({
		name: 'endDate',
		type: String,
		required: false,
		description: 'endDate',
	})
	@ApiOkResponse({
		schema: {
			example: {
				items: [
					{
						_id: '6476ef7d1f0419cd330fe128',
						facilityID: {} as unknown as Facility,
						startDate: new Date(),
						endDate: new Date(),
						content: 'string',
						createdAt: new Date(),
						updatedAt: new Date(),
					} as Holiday,
				],
				total: 1,
				options: {
					limit: 10,
					offset: 0,
					searchField: 'facilityID',
					searchValue: 'string',
					sortField: 'startDate',
					sortOrder: 'asc',
				} as ListOptions<Holiday>,
			} as ListResponse<Holiday>,
		},
	})
	@ApiNotFoundResponse({
		schema: {
			example: {
				code: '404',
				message: 'Facility not found!',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiBadRequestResponse({
		schema: {
			example: {
				code: '400',
				message: '[Input] invalid!',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	async getAllHolidaysByFacility(
		@Param('facilityID') facilityID: string,
		@Query() options: ListOptions<Holiday>,
	) {
		return await this.facilityService.findAllHoliday(facilityID, options);
	}

	@Public()
	@Get(':facilityID/package-types')
	@ApiOperation({
		summary: 'Get all Package Type by facilityID',
		description: `All role can use this API \n Only sort by Order`,
	})
	@ApiDocsPagination('PackageType')
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiOkResponse({
		schema: {
			example: {
				items: [
					{
						_id: '6476ef7d1f0419cd330fe128',
						facilityID: {} as unknown as Facility,
						name: 'GYM GYM 1',
						description: 'cơ sở tập gym chất lượng',
						price: 100000,
						order: 0,
						createdAt: new Date(),
						updatedAt: new Date(),
					} as PackageType,
				],
				total: 1,
				options: {
					limit: 10,
					offset: 0,
					searchField: 'name',
					searchValue: 'string',
					sortField: '_id',
					sortOrder: 'asc',
				} as ListOptions<PackageType>,
			} as ListResponse<PackageType>,
		},
	})
	@ApiNotFoundResponse({
		schema: {
			example: {
				code: '404',
				message: 'Facility not found!',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiBadRequestResponse({
		schema: {
			example: {
				code: '400',
				message: '[Input] invalid!',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	async getAllPackageTypeByFacility(
		@Param('facilityID') facilityID: string,
		@Query() filter: ListOptions<PackageType>,
	) {
		return await this.facilityService.getAllPackageType(facilityID, filter);
	}

	@ApiBearerAuth()
	@UseGuards(OwnershipFacilityGuard)
	@Post(':facilityID/holidays')
	@ApiOperation({
		summary: 'Create new Holiday by facilityID',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({
		name: 'facilityID',
		type: String,
		description: 'Facility ID',
	})
	@ApiBody({
		type: HolidayDto,
		examples: {
			test: {
				value: {
					startDate: new Date('2024-07-01T11:43:14.752Z'),
					endDate: new Date('2024-07-02T11:43:14.752Z'),
					content: 'string',
				} as HolidayDto,
			},
		},
	})
	@ApiCreatedResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				facilityID: {} as unknown as Facility,
				startDate: new Date('2024-07-01T11:43:14.752Z'),
				endDate: new Date('2024-07-02T11:43:14.752Z'),
				content: 'string',
				createdAt: new Date(),
				updatedAt: new Date(),
			} as Holiday,
		},
	})
	@ApiUnauthorizedResponse({
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiForbiddenResponse({
		schema: {
			example: {
				code: '403',
				message: 'Forbidden resource',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiBadRequestResponse({
		schema: {
			example: {
				code: '400',
				message: '[Input] invalid!',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	async createHolidayByFacility(
		@Param('facilityID') facilityID: string,
		@Body() data: HolidayDto,
	) {
		return await this.facilityService.createHoliday(facilityID, data);
	}

	@ApiBearerAuth()
	@UseGuards(OwnershipFacilityGuard)
	@Post(':facilityID/package-types')
	@ApiOperation({
		summary: 'Create new Package Type by facilityID',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiBody({
		type: CreatePackageTypeDto,
		examples: {
			test1: {
				value: {
					name: 'Standard Package 1',
					description: 'This is a standard package 1',
					price: 998.99,
				} as CreatePackageTypeDto,
			},
			test2: {
				value: {
					name: 'Standard Package 2',
					description: 'This is a standard package 2',
					price: 888.88,
				} as CreatePackageTypeDto,
			},
		},
	})
	@ApiCreatedResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				facilityID: {} as unknown as Facility,
				name: 'GYM GYM 1',
				description: 'cơ sở tập gym chất lượng',
				price: 100000,
				order: 0,
				createdAt: new Date(),
				updatedAt: new Date(),
			} as PackageType,
		},
	})
	@ApiUnauthorizedResponse({
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiForbiddenResponse({
		schema: {
			example: {
				code: '403',
				message: 'Forbidden resource',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiBadRequestResponse({
		schema: {
			example: {
				code: '400',
				message: '[Input] invalid!',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	async createPackageType(
		@Param('facilityID') facilityID: string,
		@Body() data: CreatePackageTypeDto,
	) {
		return await this.facilityService.createPackageType(facilityID, data);
	}

	@Post()
	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.FACILITY_OWNER)
	@ApiOperation({
		summary: 'Create a new facility',
	})
	@ApiBody({
		type: CreateFacilityDto,
		examples: {
			example1: {
				value: {
					brandID: '64944c7c2d7cf0ec0dbb4051',
					facilityCategoryID: [
						'64944c7c2d7cf0ec0dbb4051',
						'64944c7c2d7cf0ec0dbb4051',
					],
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
					location: { coordinates: [105.778274, 10.04407] },
					summary: 'Chất lượng là danh dự',
					description:
						'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book',
					state: 'ACTIVE',
					phone: '84906943567',
					scheduleDto: {
						type: 'DAILY',
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
				} as CreateFacilityDto,
			},
		},
		// schema: {
		// 	type: 'object',
		// 	properties: {
		// 		images: {
		// 			type: 'array',
		// 			items: {
		// 				type: 'string',
		// 				format: 'binary',
		// 			},
		// 		},
		// 		brandID: { type: 'string' },
		// 		facilityCategoryID: { type: 'string' },
		// 		name: { type: 'string' },
		// 		address: {
		// 			type: 'object',
		// 			properties: {
		// 				street: { type: 'string' },
		// 				province: { type: 'string' },
		// 				provinceCode: { type: 'string' },
		// 				district: { type: 'string' },
		// 				districtCode: { type: 'string' },
		// 				commune: { type: 'string' },
		// 				communeCode: { type: 'string' },
		// 			},
		// 		},
		// 		summary: { type: 'string' },
		// 		description: { type: 'string' },
		// 		coordinates: {
		// 			type: 'array',
		// 			items: {
		// 				type: 'number',
		// 				format: 'number',
		// 			},
		// 		},
		// 		scheduleType: { type: 'string', enum: ['DAILY', 'WEEKLY', 'MONTHLY'] },
		// 	},
		// },
	})
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				data: {
					_id: '1233456',
					brandID: {},
					facilityCategoryID: {},
					ownerID: {},
					name: 'City gym',
					address: {
						street: '30/4',
						commune: 'Phường Xuân Khánh',
						communeCode: '011',
						district: 'Quận Ninh Kiều',
						districtCode: '056',
						province: 'Thành phố Cần Thơ',
						provinceCode: '065',
					},
					summary: 'Phòng gym thân thiện',
					description: 'Nhiều dụng cụ tập luyện',
					location: { coordinates: [10.031966330522316, 105.76892820319247] },
					state: State.ACTIVE,
					status: Status.APPROVED,
					averageStar: 5,
					photos: [],
					reviews: [],
					createdAt: new Date(),
					updatedAt: new Date(),
				} as Facility,
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	@UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 5 }]))
	createFacility(
		@Body() createFacilityDto: CreateFacilityDto,
		@Req() req: any,
		@UploadedFiles()
		files?: {
			images?: Express.Multer.File[];
		},
	) {
		return this.facilityService.create(
			createFacilityDto,
			req,
			files || undefined,
		);
	}

	@Delete(':facilityID')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Delete Facility by facilityID',
	})
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: null,
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Facility not found!',
	})
	@UseGuards(OwnershipFacilityGuard)
	deleteFacilityById(@Param('facilityID') facilityID, @Req() req: any) {
		return this.facilityService.delete(facilityID, req);
	}

	@Patch('reviews/:reviewID')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Delete one review by ID',
	})
	@ApiParam({ name: 'reviewID', type: String, description: 'Review ID' })
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					_id: 'string',
					brandID: {},
					facilityCategoryID: {},
					ownerID: {},
					name: 'City Gym',
					address: {
						street: '30/4',
						commune: 'Phường Xuân Khánh',
						communeCode: '011',
						district: 'Quận Ninh Kiều',
						districtCode: '056',
						province: 'Thành phố Cần Thơ',
						provinceCode: '065',
					},
					averageStar: null,
					summary: 'CHẤT LƯỢNG LÀ DANH DỰ',
					description: 'ABC',
					location: { coordinates: [10.031966330522316, 105.76892820319247] },
					state: State.ACTIVE,
					status: Status.APPROVED,
					photos: [],
					reviews: [],
					schedule: {},
					createdAt: new Date(),
					updatedAt: new Date(),
				} as Facility,
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	async deleteReviewByID(
		@Param('facilityID') facilityID,
		@Param('reviewID') reviewID,
		@Req() req: any,
	) {
		return await this.facilityService.deleteReviewByID(req, reviewID);
	}

	@ApiBearerAuth()
	@UseGuards(OwnershipFacilityGuard)
	@Patch(':facilityID/package-types/swap-order')
	@ApiOperation({
		summary: 'Swap Package Type order by facilityID',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiBody({
		type: UpdateOrderDto,
		examples: {
			Test1: {
				value: {
					order1: 0,
					order2: 1,
				} as UpdateOrderDto,
			},
			Test2: {
				value: {
					order1: 1,
					order2: 3,
				} as UpdateOrderDto,
			},
		},
	})
	@ApiOkResponse({
		schema: {
			example: {
				message: 'Swap order successful!',
			},
		},
	})
	@ApiUnauthorizedResponse({
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiForbiddenResponse({
		schema: {
			example: {
				code: '403',
				message: 'Forbidden resource',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiNotFoundResponse({
		schema: {
			example: {
				code: '404',
				message: 'Facility not found!',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiBadRequestResponse({
		schema: {
			example: {
				code: '400',
				message: '[Input] invalid!',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	async swapPackageTypeInList(
		@Param('facilityID') facilityID: string,
		@Body() data: UpdateOrderDto,
	) {
		return await this.facilityService.swapPackageTypeInList(facilityID, data);
	}

	// @UseGuards(OwnershipFacilityGuard)
	@Patch(':facilityID/photos/add')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Add the photos to the facility, use for Owner Facility',
	})
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				images: {
					type: 'array',
					items: {
						type: 'string',
						format: 'binary',
						description: 'accept: jpeg|png',
					},
				},
			},
		},
	})
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					_id: 'string',
					brandID: {},
					facilityCategoryID: {},
					ownerID: {},
					name: 'City Gym',
					address: {
						street: '30/4',
						commune: 'Phường Xuân Khánh',
						communeCode: '011',
						district: 'Quận Ninh Kiều',
						districtCode: '056',
						province: 'Thành phố Cần Thơ',
						provinceCode: '065',
					},
					averageStar: null,
					summary: 'CHẤT LƯỢNG LÀ DANH DỰ',
					description: 'ABC',
					location: { coordinates: [10.031966330522316, 105.76892820319247] },
					state: State.ACTIVE,
					status: Status.APPROVED,
					photos: [],
					reviews: [],
					schedule: {},
					createdAt: new Date(),
					updatedAt: new Date(),
				} as Facility,
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	@UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 5 }]))
	async addPhotoFacility(
		@Param('facilityID') facilityID,
		@Req() req: any,
		@UploadedFiles()
		files: {
			images: Express.Multer.File[];
		},
	) {
		return await this.facilityService.addPhoto(facilityID, req, files);
	}

	@Patch(':facilityID')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Modified facility',
	})
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiBody({
		type: UpdateFacilityDto,
		examples: {
			example1: {
				value: {
					brandID: '1123456',
					facilityCategoryID: '1233',
					name: 'City gym',
					address: {
						street: '30/4',
						commune: 'Phường Xuân Khánh',
						communeCode: '011',
						district: 'Quận Ninh Kiều',
						districtCode: '056',
						province: 'Thành phố Cần Thơ',
						provinceCode: '065',
					},
					summary: 'CHẤT LƯỢNG LÀ DANH DỰ',
					description: 'HIỆN ĐẠI BẬT NHẤT',
					coordinates: [45, 54],
					schedule: '64b4aff0f4f2b881b96475ea',
					state: State.ACTIVE,
					location: { coordinates: [105, 10] } as LocationDTO,
				} as UpdateFacilityDto,
			},
		},
	})
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					_id: 'string',
					brandID: {},
					facilityCategoryID: {},
					ownerID: {},
					name: 'City Gym',
					address: {
						street: '30/4',
						commune: 'Phường Xuân Khánh',
						communeCode: '011',
						district: 'Quận Ninh Kiều',
						districtCode: '056',
						province: 'Thành phố Cần Thơ',
						provinceCode: '065',
					},
					averageStar: null,
					summary: 'CHẤT LƯỢNG LÀ DANH DỰ',
					description: 'ABC',
					location: { coordinates: [10.031966330522316, 105.76892820319247] },
					state: State.ACTIVE,
					status: Status.APPROVED,
					photos: [],
					reviews: [],
					schedule: {},
					createdAt: new Date(),
					updatedAt: new Date(),
				} as Facility,
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	@UseGuards(OwnershipFacilityGuard)
	updateFacility(
		@Param('facilityID') facilityID,
		@Body() body: UpdateFacilityDto,
		@Req() req: any,
	) {
		return this.facilityService.update(facilityID, body, req);
	}

	@Patch(':facilityID/status')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Update status facility, only for ADMIN ROLE',
	})
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiBody({
		type: UpdateFacilityDto,
		examples: {
			example1: {
				value: {
					status: Status.APPROVED,
				},
			},
		},
	})
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					_id: 'string',
					brandID: {},
					facilityCategoryID: {},
					ownerID: {},
					name: 'City Gym',
					address: {
						street: '30/4',
						commune: 'Phường Xuân Khánh',
						communeCode: '011',
						district: 'Quận Ninh Kiều',
						districtCode: '056',
						province: 'Thành phố Cần Thơ',
						provinceCode: '065',
					},
					averageStar: null,
					summary: 'CHẤT LƯỢNG LÀ DANH DỰ',
					description: 'ABC',
					location: { coordinates: [10.031966330522316, 105.76892820319247] },
					state: State.ACTIVE,
					status: Status.APPROVED,
					photos: [],
					reviews: [],
					schedule: {},
					createdAt: new Date(),
					updatedAt: new Date(),
				} as Facility,
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	updateStatus(
		@Param('facilityID') facilityID,
		@Body() body: UpdateStatusFacilityDto,
		@Req() req: any,
	) {
		return this.facilityService.updateStatus(facilityID, req, body.status);
	}

	@Patch(':facilityID/reviews/add')
	@ApiOperation({
		summary: 'Add the newest reviews to the facility',
	})
	@ApiBearerAuth()
	@ApiConsumes('multipart/form-data')
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				images: {
					type: 'array',
					items: {
						type: 'string',
						format: 'binary',
						description: 'accept: jpeg|png',
					},
				},
				rating: {
					type: 'number',
				},
				comment: {
					type: 'string',
				},
			},
		},
	})
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					_id: '1233456',
					brandID: {},
					facilityCategoryID: {},
					ownerID: {},
					name: 'City gym',
					address: {
						street: '30/4',
						commune: 'Phường Xuân Khánh',
						communeCode: '011',
						district: 'Quận Ninh Kiều',
						districtCode: '056',
						province: 'Thành phố Cần Thơ',
						provinceCode: '065',
					},
					summary: 'Phòng gym thân thiện',
					description: 'Nhiều dụng cụ tập luyện',
					coordinationlocation: {
						coordinates: [10.031966330522316, 105.76892820319247],
					},
					state: State.ACTIVE,
					status: Status.APPROVED,
					averageStar: 5,
					photos: [],
					reviews: [
						{
							accountID: '6475692ce552996bd0014c94',
							facilityID: '649011312a7e17d72b9d724b',
							rating: 4,
							comment:
								'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
							photos: [
								{
									createdAt: '2023-06-19T08:36:43.955Z',
									updatedAt: '2023-06-19T08:36:43.955Z',
									ownerID: '16871638035675p6zo2e5x3j',
									name: '1687163803571-508394429.jpeg',
									__id: '6490139b2a7e17d72b9d725e',
									imageURL:
										'http://localhost:8080/16871638035675p6zo2e5x3j/1687163803571-508394429.jpeg',
								},
							],
						},
					],
					createdAt: new Date(),
					updatedAt: new Date(),
				} as unknown as Facility,
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	@UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 5 }]))
	async addReviewFacility(
		@Param('facilityID') facilityID,
		@Body() reviewDto: CreateReviewDto,
		@Req() req: any,
		@UploadedFiles()
		files?: {
			images?: Express.Multer.File[];
		},
	) {
		return await this.facilityService.addReview(
			facilityID,
			req,
			reviewDto,
			files || null,
		);
	}

	@Patch(':facilityID/photos/delete')
	@UseGuards(OwnershipFacilityGuard)
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Delete photos of facility, use for Owner Facility',
	})
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiBody({
		description: 'listDeleteID is array _id of image which you want to deleted',
		schema: {
			type: 'object',
			properties: {
				listDeleteID: {
					type: 'array',
					items: {
						type: 'string',
						format: 'ObjectId',
					},
				},
			},
		},
	})
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					_id: 'string',
					brandID: {},
					facilityCategoryID: {},
					ownerID: {},
					name: 'City Gym',
					address: {
						street: '30/4',
						commune: 'Phường Xuân Khánh',
						communeCode: '011',
						district: 'Quận Ninh Kiều',
						districtCode: '056',
						province: 'Thành phố Cần Thơ',
						provinceCode: '065',
					},
					averageStar: null,
					summary: 'CHẤT LƯỢNG LÀ DANH DỰ',
					description: 'ABC',
					location: { coordinates: [10.031966330522316, 105.76892820319247] },
					state: State.ACTIVE,
					status: Status.APPROVED,
					photos: [],
					reviews: [],
					schedule: {},
					createdAt: new Date(),
					updatedAt: new Date(),
				} as Facility,
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	async deletePhotoFacility(
		@Param('facilityID') facilityID,
		@Req() req: any,
		@Body() body: DeletePhotoOfFacilityDto,
	) {
		return await this.facilityService.deletePhoto(
			facilityID,
			req,
			body.listDeleteID,
		);
	}

	@Patch(':facilityID/reviews/delete')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Delete reviews of facility',
	})
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiBody({
		description:
			'listDeleteID is array _id of reivew which you want to deleted',
		schema: {
			type: 'object',
			properties: {
				listDeleteID: {
					type: 'array',
					items: {
						type: 'string',
						format: 'ObjectId',
					},
				},
			},
		},
	})
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					_id: 'string',
					brandID: {},
					facilityCategoryID: {},
					ownerID: {},
					name: 'City Gym',
					address: {
						street: '30/4',
						commune: 'Phường Xuân Khánh',
						communeCode: '011',
						district: 'Quận Ninh Kiều',
						districtCode: '056',
						province: 'Thành phố Cần Thơ',
						provinceCode: '065',
					},
					averageStar: null,
					summary: 'CHẤT LƯỢNG LÀ DANH DỰ',
					description: 'ABC',
					location: { coordinates: [10.031966330522316, 105.76892820319247] },
					state: State.ACTIVE,
					status: Status.APPROVED,
					photos: [],
					reviews: [],
					schedule: {},
					createdAt: new Date(),
					updatedAt: new Date(),
				} as Facility,
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	async deleteReviewFacility(
		@Param('facilityID') facilityID,
		@Req() req: any,
		@Body() body: DeleteReviewOfFacilityDto,
	) {
		return await this.facilityService.deleteReview(
			facilityID,
			req,
			body.listDeleteID,
		);
	}

	@ApiBearerAuth()
	@UseGuards(OwnershipFacilityGuard)
	@Post(':facilityID/promotions')
	@ApiOperation({
		summary: 'Create facility promotion',
	})
	@ApiBearerAuth()
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility id' })
	@ApiBody({
		type: CreatePromotionDto,
		examples: {
			test1: {
				value: {
					name: 'Mừng hè đi tập gym nè',
					description: 'Chính sách mô tả',
					couponCode: '066',
					value: 10,
					method: 'PERCENT',
					minPriceApply: 0,
					maxValue: 10000,
					maxQuantity: 45,
					startDate: new Date(),
					endDate: new Date(),
					customerType: 'MEMBER',
					status: 'ACTIVE',
				} as CreatePromotionDto,
			},
		},
	})
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					_id: 'string',
					targetID: '6498f23e20d189a6b1607c7e',
					type: 'FACILITY',
					name: 'Mừng hè đi tập gym nè',
					description: 'Chính sách mô tả',
					couponCode: '066',
					value: 10,
					method: 'PERCENT',
					minPriceApply: 0,
					maxValue: 10000,
					maxQuantity: 45,
					startDate: new Date(),
					endDate: new Date(),
					customerType: 'MEMBER',
					status: 'ACTIVE',
					createdAt: new Date(),
					updatedAt: new Date(),
				} as Promotion,
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	createPromotion(
		@Param('facilityID') id: string,
		@Body() body: CreatePromotionDto,
	) {
		return this.facilityService.createPromotion(id, body);
	}

	@Public()
	@Get(':facilityID/promotions')
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility id' })
	@ApiOperation({
		summary: 'Get many facility promotion',
	})
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					_id: 'string',
					targetID: '6498f23e20d189a6b1607c7e',
					type: 'FACILITY',
					name: 'Mừng hè đi tập gym nè',
					description: 'Chính sách mô tả',
					couponCode: '066',
					value: 10,
					method: 'PERCENT',
					minPriceApply: 0,
					maxValue: 10000,
					maxQuantity: 45,
					startDate: new Date(),
					endDate: new Date(),
					customerType: 'MEMBER',
					status: 'ACTIVE',
					createdAt: new Date(),
					updatedAt: new Date(),
				} as Promotion,
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	findManyPromotion(@Param('facilityID') facilityID: string) {
		return this.facilityService.findManyPromotion(facilityID);
	}

	@ApiBearerAuth()
	@Patch('promotion/:promotionID')
	@ApiOperation({
		summary: 'update Facility Promotion',
		description: 'Allow facility owner to update facility promotion',
	})
	@ApiParam({ name: 'promotionID', type: String, description: 'Promotion ID' })
	@ApiBody({
		type: UpdatePromotionDto,
		examples: {
			Facility_Promotion: {
				value: {
					name: 'string',
					description: 'string',
					couponCode: 'string',
					value: 1,
					method: PromotionMethod.NUMBER,
					minPriceApply: 1,
					maxValue: 1,
					maxQuantity: 1,
					endDate: new Date(),
					customerType: CustomerType.CUSTOMER,
					status: PromotionStatus.ACTIVE,
				} as UpdatePromotionDto,
			},
		},
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				targetID: {},
				type: PromotionType.BILL,
				name: 'string',
				description: 'string',
				couponCode: 'string',
				value: 1,
				method: PromotionMethod.NUMBER,
				minPriceApply: 1,
				maxValue: 1,
				maxQuantity: 1,
				startDate: new Date(),
				endDate: new Date(),
				customerType: CustomerType.CUSTOMER,
				status: PromotionStatus.ACTIVE,
				createdAt: new Date(),
				updatedAt: new Date(),
			} as Promotion,
		},
	})
	@ApiResponse({
		status: 400,
		schema: {
			example: {
				code: '400',
				message: 'Bad request',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 401,
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: '403',
				message: `Forbidden resource`,
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 404,
		schema: {
			example: {
				code: '404',
				message: 'Not found document with that ID',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	async updatePromotion(
		@Param('promotionID') promotionID: string,
		@Body() body: UpdatePromotionDto,
		@Req() req: any,
	) {
		return await this.facilityService.updatePromotion(promotionID, body, req);
	}

	@ApiBearerAuth()
	@Delete('promotion/:promotionID')
	@ApiOperation({
		summary: 'delete Facility Promotion',
		description: 'Allow facility owner to delete facility promotion',
	})
	@ApiParam({ name: 'promotionID', type: String, description: 'Promotion ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				code: '200',
				message: 'Deleted successfully',
				details: null,
			},
		},
	})
	@ApiResponse({
		status: 401,
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: '403',
				message: `Forbidden resource`,
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 404,
		schema: {
			example: {
				code: '404',
				message: 'Not found document with that ID',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	deletePromotion(@Param('promotionID') promotionID: string, @Req() req: any) {
		return this.facilityService.deletePromotion(promotionID, req);
	}
}
