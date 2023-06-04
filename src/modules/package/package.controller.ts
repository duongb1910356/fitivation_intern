import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { Public } from '../auth/utils';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Package, TimeType } from './entities/package.entity';
import { CreatePackageDto } from './dto/create-package-dto';
import { UpdatePackageDto } from './dto/update-package-dto';
import { Roles } from 'src/decorators/role-decorator/role.decorator';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import { PackageType } from '../package-type/entities/package-type.entity';
import { Facility } from '../facility/schemas/facility.schema';
import {
	ErrorResponse,
	ListOptions,
	ListResponse,
} from 'src/shared/response/common-response';
import { UserRole } from '../users/schemas/user.schema';
import { RolesGuard } from 'src/decorators/role-decorator/role.guard';

@ApiTags('packages')
@Controller()
export class PackageController {
	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN)
	@Get('/packages')
	@ApiOperation({
		summary: 'Get All Packages',
		description: `Only admin can use this API`,
	})
	@ApiDocsPagination('Packages')
	@ApiOkResponse({
		schema: {
			example: {
				items: [
					{
						_id: '6476ef7d1f0419cd330fe128',
						packageTypeID: {} as unknown as PackageType,
						facilityID: {} as unknown as Facility,
						type: TimeType.ONE_MONTH,
						price: 100000,
						createdAt: new Date(),
						updatedAt: new Date(),
					} as Package,
				],
				total: 1,
				options: {
					limit: 10,
					offset: 0,
					searchField: 'facilityID',
					searchValue: 'string',
					sortField: '_id',
					sortOrder: 'asc',
				} as ListOptions<Package>,
			} as ListResponse<Package>,
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
	getAllPackages(@Query() filter: ListOptions<Package>) {
		console.log(filter);
		//
	}

	@Public()
	@Get('packages/:packageId')
	@ApiOperation({
		summary: 'Get Package by packageId',
		description: `All role can use this API`,
	})
	@ApiParam({ name: 'packageID', type: String, description: 'Package ID' })
	@ApiOkResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				packageTypeID: {} as unknown as PackageType,
				facilityID: {} as unknown as Facility,
				type: TimeType.ONE_MONTH,
				price: 100000,
				createdAt: new Date(),
				updatedAt: new Date(),
			} as Package,
		},
	})
	@ApiNotFoundResponse({
		schema: {
			example: {
				code: '404',
				message: 'PackageType not found!',
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
	getPackage(@Param('packageID') packageID: string) {
		console.log(packageID);
		//
	}

	@Public()
	@Get('package-type/:packageTypeId/packages')
	@ApiOperation({
		summary: 'Get all Package by packageTypeId',
		description: `All role can use this API`,
	})
	@ApiDocsPagination('PackageTypes')
	@ApiParam({
		name: 'packageTypeId',
		type: String,
		description: 'Package Type ID',
	})
	@ApiOkResponse({
		schema: {
			example: {
				items: [
					{
						_id: '6476ef7d1f0419cd330fe128',
						packageTypeID: {} as unknown as PackageType,
						facilityID: {} as unknown as Facility,
						type: TimeType.ONE_MONTH,
						price: 100000,
						createdAt: new Date(),
						updatedAt: new Date(),
					} as Package,
				],
				total: 1,
				options: {
					limit: 10,
					offset: 0,
					searchField: 'facilityID',
					searchValue: 'string',
					sortField: '_id',
					sortOrder: 'asc',
				} as ListOptions<Package>,
			} as ListResponse<Package>,
		},
	})
	@ApiNotFoundResponse({
		schema: {
			example: {
				code: '404',
				message: 'PackageType not found!',
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
	getAllPackagesByPackageType(
		@Param('packageTypeId') packageTypeId: string,
		@Query() filter: ListOptions<Package>,
	) {
		//
		console.log(packageTypeId, filter);
	}

	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN, UserRole.FACILITY_OWNER)
	@Post('package-type/:packageTypeId/packages')
	@ApiOperation({
		summary: 'Create new Package by packageTypeId',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({
		name: 'packageTypeId',
		type: String,
		description: 'Package Type ID',
	})
	@ApiBody({
		type: CreatePackageDto,
		examples: {
			test1: {
				value: {
					type: TimeType.ONE_MONTH,
					price: 90000,
				} as CreatePackageDto,
			},
			test2: {
				value: {
					type: TimeType.SIX_MONTH,
					price: 540000,
				} as CreatePackageDto,
			},
		},
	})
	@ApiCreatedResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				packageTypeID: {} as unknown as PackageType,
				facilityID: {} as unknown as Facility,
				type: TimeType.ONE_MONTH,
				price: 100000,
				createdAt: new Date(),
				updatedAt: new Date(),
			} as Package,
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
	createPackageType(
		@Param('packageTypeId') packageTypeId: string,
		@Body() data: CreatePackageDto,
	) {
		console.log(packageTypeId, data);
	}

	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN, UserRole.FACILITY_OWNER)
	@Patch('packages/:packageID')
	@ApiOperation({
		summary: 'Update Package by packageId',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({
		name: 'packageID',
		type: String,
		description: 'Package ID',
	})
	@ApiBody({
		type: UpdatePackageDto,
		examples: {
			Test1: {
				value: {
					price: 540000,
				} as UpdatePackageDto,
			},
			Test2: {
				value: {
					price: 90000,
				} as UpdatePackageDto,
			},
		},
	})
	@ApiOkResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				packageTypeID: {} as unknown as PackageType,
				facilityID: {} as unknown as Facility,
				type: TimeType.ONE_MONTH,
				price: 90000,
				createdAt: new Date(),
				updatedAt: new Date(),
			} as Package,
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
				message: 'Not found Package to update!',
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
	updatePackageType(
		@Param('packageID') packageID: string,
		@Body() data: UpdatePackageDto,
	) {
		console.log(packageID, data);
		//
	}

	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN, UserRole.FACILITY_OWNER)
	@Delete('package/:packageID')
	@ApiOperation({
		summary: 'Delete Package by packageId',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({
		name: 'packageID',
		type: String,
		description: 'Package ID',
	})
	@ApiOkResponse({
		schema: {
			example: {
				message: 'Delete Package successful!',
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
				message: 'Package not found!',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	deletePackage(@Param('packageID') packageID: string) {
		console.log(packageID);
		//
	}
}
