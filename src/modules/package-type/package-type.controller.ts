import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { CreatePackageTypeDto } from './dto/create-package-type-dto';
import { Public } from '../auth/utils';

@ApiTags('package-type')
@Controller('package-type')
export class PackageTypeController {
	@Get(':id')
	@ApiResponse({ status: 200, description: 'Get package type by ID' })
	getPackageTypeById(@Param('id') id: string) {
		// Logic để lấy thông tin package type theo ID
	}

	@Get()
	@ApiResponse({ status: 200, description: 'Get all package types' })
	getAllPackageTypes() {
		// Logic để lấy tất cả package types
	}

	@Public()
	@Post()
	@ApiOperation({
		summary: 'Create new Package Type',
		description: `*    Admin and Facility Owner can use this API`,
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
	@ApiResponse({
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					name: 'User',
					description: 'This is a standard package',
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
	@ApiResponse({ status: 200, description: 'Update package type by ID' })
	updatePackageType(@Param('id') id: string, @Body() data: any) {
		// Logic để cập nhật package type theo ID
	}

	@Delete(':id')
	@ApiResponse({ status: 204, description: 'Delete package type by ID' })
	deletePackageType(@Param('id') id: string) {
		// Logic để xóa package type theo ID
	}
}
