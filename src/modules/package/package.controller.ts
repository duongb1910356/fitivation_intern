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
import { Public } from '../auth/utils';
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiCreatedResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import { Package, TimeType } from './entities/package.entity';
import { CreatePackageDto } from './dto/create-package-dto';
import { UpdatePackageDto } from './dto/update-package-dto';

@ApiTags('package')
@Controller('package')
export class PackageController {
	@Public()
	@Get(':id')
	@ApiOperation({
		summary: 'Get package by packageId',
		description: 'All role can use this API',
	})
	@ApiParam({ name: 'id', type: String, description: 'Package ID' })
	@ApiOkResponse({ type: Package, status: 200 })
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 400,
		description: 'Package not found!',
	})
	getPackage(@Param('id') id: string) {
		//Logic de lay thong tin package theo ID
	}

	@Post()
	@ApiOperation({
		summary: 'Create new Package',
		description: `Facility Owner can use this API`,
	})
	@ApiBody({
		type: CreatePackageDto,
		examples: {
			test1: {
				value: {
					packageTypeID: '59001f60c122611f9ae47f67',
					facilityID: '2611f9ae47f6759001f60c12',
					type: TimeType.ONE_MONTH,
					price: 99.99,
				} as CreatePackageDto,
			},
			test2: {
				value: {
					packageTypeID: '2611f9ae47f6759001f60c12',
					facilityID: 'c122611f9ae47f6759001f60',
					type: TimeType.SIX_MONTH,
					price: 999.99,
				} as CreatePackageDto,
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
					price: 999.99,
				},
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	@ApiInternalServerErrorResponse({
		status: 500,
		description: 'Internal server error',
	})
	createPackage(@Body() data: any) {
		//Logic tao mot package
	}

	@Patch(':id')
	@ApiOperation({
		summary: 'Update Package information by Package_Id',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({ name: 'id', type: String, description: 'Package ID' })
	@ApiBody({
		type: UpdatePackageDto,
		examples: {
			Test1: {
				value: {
					price: 100000,
				} as UpdatePackageDto,
			},
		},
	})
	@ApiOkResponse({
		status: 200,
		description: 'Update Package successfull',
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Not found Package to update!',
	})
	@ApiBadRequestResponse({ status: 400, description: 'Invalid request' })
	@ApiInternalServerErrorResponse({
		status: 500,
		description: 'Internal server error',
	})
	updatePackage(@Param('id') id: string, @Body() data: any) {
		// Logic để cập nhật package type theo ID
	}

	@Delete(':id')
	@ApiOperation({
		summary: 'Delete Package by Package_Id',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({ name: 'id', type: String, description: 'Package ID' })
	@ApiOkResponse({
		status: 204,
		description: 'Delete package successfull',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Package not found!',
	})
	deletePackage(@Param('id') id: string) {
		// Logic để xóa package type theo ID
	}
}
