import {
	Controller,
	Get,
	Post,
	Patch,
	Param,
	Delete,
	BadRequestException,
	NotFoundException,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiTags,
} from '@nestjs/swagger';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import {
	ErrorResponse,
	ListOptions,
	ListResponse,
} from 'src/shared/response/common-response';
import { Brand } from './schemas/brand.schema';
import { User } from '../users/schemas/user.schema';
import { Facility } from '../facility/schemas/facility.schema';
import { Photo } from '../photo/schemas/photo.schema';
import { ScheduleType } from '../facility-schedule/entities/facility-schedule.entity';
import { State, Status } from 'src/shared/enum/facility.enum';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('brands')
@Controller('brands')
export class BrandController {
	constructor(private readonly brandService: BrandService) {}

	@Post()
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Create a new brand',
	})
	@ApiBody({
		type: CreateBrandDto,
		examples: {
			example1: {
				value: {
					name: 'string',
				} as CreateBrandDto,
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
					accountID: {},
					name: 'City Gym',
					createdAt: new Date(),
					updatedAt: new Date(),
				} as Brand,
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	createBrand() {
		// return this.brandService.create(createBrandDto);
	}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get list of Brand',
	})
	@ApiDocsPagination('Brand')
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: '123456',
						accountID: {} as unknown as User,
						name: 'City Gym',
						createdAt: new Date(),
						updatedAt: new Date(),
					} as Brand,
				],
				total: 1,
				options: {
					limit: 5,
					offset: 5,
					searchField: 'createdAt',
					searchValue: 'string',
					sortField: 'createdAt',
					sortOrder: 'desc',
				} as ListOptions<Brand>,
			} as ListResponse<Brand>,
		},
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Brands not found!',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid',
	})
	findAll() {
		return this.brandService.findAll();
	}

	@Public()
	@Get(':id/facilities')
	@ApiOperation({
		summary: 'Get facilities of a brand',
	})
	@ApiQuery({ name: 'id', required: true, type: String, example: '123456' })
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
						coordinationLocation: [65, 56],
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
						scheduleType: ScheduleType.DAILY,
						createdAt: new Date(),
						updatedAt: new Date(),
					} as Facility,
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
		description: 'Brands not found!',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid',
	})
	findOne(@Param('id') id: string) {
		return this.brandService.findOne(+id);
	}

	@Patch(':id')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Modified brand',
	})
	@ApiParam({ name: 'id', type: String, description: 'id brand' })
	@ApiBody({
		type: UpdateBrandDto,
		examples: {
			example1: {
				value: { name: 'String' } as UpdateBrandDto,
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
					accountID: {},
					name: 'City Gym',
					createdAt: new Date(),
					updatedAt: new Date(),
				} as Brand,
			},
		},
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Brands not found!',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid',
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
	updateBrand() {
		//
	}

	@Delete(':id')
	@ApiBearerAuth()
	@ApiParam({ name: 'id', type: String, description: 'id brand' })
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: null,
			},
		},
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Brands not found!',
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
	deleteBrand() {
		//
	}
}
