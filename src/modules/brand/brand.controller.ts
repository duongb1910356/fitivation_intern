import {
	Controller,
	Get,
	Post,
	Param,
	Delete,
	BadRequestException,
	NotFoundException,
	Body,
	Req,
	Query,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import {
	ErrorResponse,
	ListOptions,
} from 'src/shared/response/common-response';
import { Brand } from './schemas/brand.schema';
import { User } from '../users/schemas/user.schema';
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
	createBrand(@Body() createBrandDto: CreateBrandDto, @Req() req: any) {
		return this.brandService.create(createBrandDto, req);
	}

	@Public()
	@Get(':brandID')
	@ApiParam({ name: 'brandID', type: String, description: 'Brand ID' })
	@ApiOperation({
		summary: 'Get Brand by ID',
	})
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				_id: '123456',
				accountID: {} as unknown as User,
				name: 'City Gym',
				createdAt: new Date(),
				updatedAt: new Date(),
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
	getBrandByID(@Param('brandID') id: string) {
		return this.brandService.findOneByID(id);
	}

	@Public()
	@Get('')
	@ApiOperation({
		summary: 'Get many Brand',
	})
	@ApiDocsPagination('Brand')
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: '123456',
						accountID: '64944c7c2d7cf0ec0dbb4051',
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
	getManyBrand(@Query() filter: ListOptions<Brand>) {
		return this.brandService.findMany(filter);
	}

	@Delete(':brandID')
	@ApiBearerAuth()
	@ApiParam({ name: 'brandID', type: String, description: 'Brand ID' })
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
	deleteBrand(@Param('brandID') id: string) {
		return this.brandService.delete(id);
	}
}
