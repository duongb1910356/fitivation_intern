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
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiCreatedResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreatePackageTypeDto } from './dto/create-package-type-dto';
import { Public } from '../auth/utils';
import { PackageType } from './entities/package-type.entity';
import { UpdatePackageTypeDto } from './dto/update-package-type-dto';
import { UpdateOrderDto } from './dto/update-order-dto';
import { Package } from '../package/entities/package.entity';
import {
	ErrorResponse,
	ListOptions,
	ListResponse,
} from 'src/shared/response/common-response';
import { Facility } from '../facility/schemas/facility.schema';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';

@ApiTags('package-type')
@Controller()
export class PackageTypeController {
	@Public()
	@Get('/package-types/')
	// @ApiBearerAuth()
	// @UseGuards(RoleGuard(UserRole.MEMBER))
	@ApiOperation({
		summary: 'Get All package-type',
		description: `Only logged in user can use this API`,
	})
	@ApiDocsPagination(PackageType, 'PackageTypes')
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
					search: 'string',
					sortBy: 'facilityID',
					sortOrder: 'asc',
				} as ListOptions<PackageType>,
			} as ListResponse<PackageType>,
		},
	})
	@ApiUnauthorizedResponse({
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<PackageType>,
		},
	})
	getAllPackageType(@Query() filter: ListOptions<PackageType>) {
		console.log(filter);
	}

	@Public()
	@Get(':id')
	@ApiOperation({
		summary: 'Get package-type by packageTypeId',
		description: `All role can use this API`,
	})
	@ApiParam({ name: 'id', type: String, description: 'PackageType ID' })
	@ApiOkResponse({
		type: PackageType,
		status: 200,
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 400,
		description: 'Package Type not found!',
	})
	getPackageType(@Param('id') id: string) {
		// Logic để lấy thông tin package type theo ID
	}

	@Public()
	@Get('/package-type/:id/package')
	@ApiOperation({
		summary: 'Get all package by packageTypeId',
		description: `All role can use this API`,
	})
	@ApiParam({ name: 'id', type: String, description: 'PackageType ID' })
	@ApiOkResponse({
		schema: {
			example: {
				items: [],
				total: 0,
				options: {},
			} as ListResponse<Package>,
		},
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 400,
		description: 'Package Type not found!',
	})
	@ApiQuery({
		name: 'sortField',
		enum: ['price', 'type'],
		enumName: 'SortField',
		required: false,
		description: 'SortField option (price or type)',
	})
	getAllPackageByPackageTypeId(@Query() filter: ListOptions) {
		//
	}

	@Post()
	@ApiOperation({
		summary: 'Create new Package Type',
		description: `Facility Owner can use this API`,
	})
	@ApiBody({
		type: CreatePackageTypeDto,
		examples: {
			test1: {
				value: {
					facilityID: '59001f60c122611f9ae47f67',
					name: 'Standard Package 1',
					description: 'This is a standard package 1',
					price: 998.99,
				} as CreatePackageTypeDto,
			},
			test2: {
				value: {
					facilityID: '611f9ae47f6759001f60c122',
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
				code: 200,
				message: 'Success',
				data: {
					name: 'User',
					description: 'This is a standard package type !',
					price: 998.99,
				},
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	createPackageType(@Body() data: any) {
		return 'Da tao moi mot goi dang ky';
	}

	@Patch(':id')
	@ApiOperation({
		summary: 'Update Package Type information by Package_Type_Id',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({ name: 'id', type: String, description: 'Package Type ID' })
	@ApiBody({
		type: UpdatePackageTypeDto,
		examples: {
			Test1: {
				value: {
					name: 'Tang co giam mo',
					description: 'Goi tap giup tang co giam mo',
					price: 100000,
				} as UpdatePackageTypeDto,
			},
		},
	})
	@ApiOkResponse({
		status: 200,
		description: 'Update Package Type successfull',
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Not found Package Type to update!',
	})
	@ApiBadRequestResponse({ status: 400, description: 'Invalid request' })
	@ApiInternalServerErrorResponse({
		status: 500,
		description: 'Internal server error',
	})
	updatePackageType(@Param('id') id: string, @Body() data: any) {
		// Logic để cập nhật package type theo ID
	}

	@Delete(':id')
	@ApiOperation({
		summary: 'Delete Package Type by Package_Type_Id',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({ name: 'id', type: String, description: 'Package Type ID' })
	@ApiOkResponse({
		status: 204,
		description: 'Delete package type successfull',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'PackageType not found!',
	})
	deletePackageType(@Param('id') id: string) {
		// Logic để xóa package type theo ID
	}

	@Patch('/swap-order/:id')
	@ApiOperation({
		summary: 'Swap Package Type order by Package_Type_Id',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({ name: 'id', type: String, description: 'Package Type ID' })
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
		status: 200,
		description: 'Update Package Type order successfull',
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Not found Package Type to update!',
	})
	@ApiInternalServerErrorResponse({
		status: 500,
		description: 'Internal server error',
	})
	@ApiBadRequestResponse({ status: 400, description: 'Invalid request' })
	swapPackageTypeInList(@Param('id') id: string) {
		//Logic để hoán đổi order của 2 TackageType
	}
}
