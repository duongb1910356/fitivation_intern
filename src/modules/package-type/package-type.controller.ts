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
import { Public } from '../auth/utils';
import { PackageType } from './entities/package-type.entity';
import { UpdatePackageTypeDto } from './dto/update-package-type-dto';
import {
	ErrorResponse,
	ListOptions,
	ListResponse,
} from 'src/shared/response/common-response';
import { Facility } from '../facility/schemas/facility.schema';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import { Package, TimeType } from '../package/entities/package.entity';
import { CreatePackageDto } from '../package/dto/create-package-dto';
import { PackageTypeService } from './package-type.service';
import { OwnershipPackageTypeGuard } from 'src/guards/ownership/ownership-package-type.guard';

@ApiTags('package-types')
@Controller('package-types')
export class PackageTypeController {
	constructor(private readonly packageTypeService: PackageTypeService) {}

	@Public()
	@Get(':packageTypeID')
	@ApiOperation({
		summary: 'Get Package Type by packageTypeID',
		description: `All role can use this API`,
	})
	@ApiParam({
		name: 'packageTypeID',
		type: String,
		description: 'PackageType ID',
	})
	@ApiOkResponse({
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
	async getPackageType(@Param('packageTypeID') packageTypeID: string) {
		return await this.packageTypeService.findOneByID(
			packageTypeID,
			'facilityID',
		);
	}

	@Public()
	@Get(':packageTypeID/packages')
	@ApiOperation({
		summary: 'Get all Package by packageTypeID',
		description: `All role can use this API`,
	})
	@ApiDocsPagination('Package')
	@ApiParam({
		name: 'packageTypeID',
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
	async getAllPackages(
		@Param('packageTypeID') packageTypeID: string,
		@Query() filter: ListOptions<Package>,
	) {
		return await this.packageTypeService.getAllPackages(packageTypeID, filter);
	}

	// @ApiBearerAuth()
	// @UseGuards(OwnershipPackageTypeGuard)
	@Public()
	@Post(':packageTypeID/packages')
	@ApiOperation({
		summary: 'Create new Package by packageTypeID',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({
		name: 'packageTypeID',
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
	async createPackage(
		@Param('packageTypeID') packageTypeID: string,
		@Body() data: CreatePackageDto,
	) {
		return await this.packageTypeService.createPackage(packageTypeID, data);
	}

	// @ApiBearerAuth()
	// @UseGuards(OwnershipPackageTypeGuard)
	@Public()
	@Patch(':packageTypeID')
	@ApiOperation({
		summary: 'Update Package Type by packageTypeID',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({
		name: 'packageTypeID',
		type: String,
		description: 'Package Type ID',
	})
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
			Test2: {
				value: {
					name: 'Goi Yoga',
					description: 'Goi tap Yoga',
					price: 90000,
				} as UpdatePackageTypeDto,
			},
		},
	})
	@ApiOkResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				facilityID: {} as unknown as Facility,
				name: 'GYM GYM 1',
				description: 'cơ sở tập gym chất lượng',
				price: 99000,
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
	@ApiNotFoundResponse({
		schema: {
			example: {
				code: '404',
				message: 'Not found PackageType to update!',
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
	async updatePackageType(
		@Param('packageTypeID') packageTypeID: string,
		@Body() data: UpdatePackageTypeDto,
	) {
		return await this.packageTypeService.update(packageTypeID, data);
	}

	// @ApiBearerAuth()
	// @UseGuards(OwnershipPackageTypeGuard)
	@Public()
	@Delete(':packageTypeID')
	@ApiOperation({
		summary: 'Delete Package Type by packageTypeID',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({
		name: 'packageTypeID',
		type: String,
		description: 'Package Type ID',
	})
	@ApiOkResponse({
		schema: {
			example: {
				message: 'Delete PackageType successful!',
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
	async deletePackageType(@Param('packageTypeID') packageTypeID: string) {
		return await this.packageTypeService.delete(packageTypeID);
	}
}
