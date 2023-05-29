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
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { CreatePackageTypeDto } from './dto/create-package-type-dto';
import { Public } from '../auth/utils';
import { PackageType } from './entities/package-type.entity';
import { UpdatePackageType } from './dto/update-package-type-dto';
import { UpdateOrderDto } from './dto/update-order-dto';

@ApiTags('package-type')
@Controller('package-type')
export class PackageTypeController {
	@Public()
	@Get(':id')
	@ApiOperation({
		summary: 'Get all package-type by Facility_Id',
		description: `All role can use this API`,
	})
	@ApiParam({ name: 'id', type: String, description: 'Facility ID' })
	@ApiResponse({ status: 200, description: 'Get all package type by ID' })
	@ApiOkResponse({
		type: PackageType,
		status: 200,
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 400,
		description: 'Package Type not found!',
	})
	getAllPackageTypeById(@Param('id') id: string) {
		// Logic để lấy thông tin package type theo ID
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
					price: 99.99,
				} as CreatePackageTypeDto,
			},
			test2: {
				value: {
					facilityID: '611f9ae47f6759001f60c122',
					name: 'Standard Package 2',
					description: 'This is a standard package 2',
					price: 88.88,
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
					description: 'This is a standard package !',
					price: 99.99,
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
		type: UpdatePackageType,
		examples: {
			Test1: {
				value: {
					name: 'Tang co giam mo',
					description: 'Goi tap giup tang co giam mo',
					price: 100000,
				} as UpdatePackageType,
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
	@ApiResponse({ status: 204, description: 'Delete package type successfull' })
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
