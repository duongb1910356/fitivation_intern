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
import { CreatePackageTypeDto } from './dto/create-package-type-dto';
import { Public } from '../auth/utils';
import { PackageType } from './entities/package-type.entity';
import { UpdatePackageTypeDto } from './dto/update-package-type-dto';
import { UpdateOrderDto } from './dto/update-order-dto';
import {
	ErrorResponse,
	ListOptions,
	ListResponse,
} from 'src/shared/response/common-response';
import { Facility } from '../facility/schemas/facility.schema';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import { Roles } from 'src/decorators/role-decorator/role.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { RolesGuard } from 'src/decorators/role-decorator/role.guard';

@ApiTags('package-types')
@Controller()
export class PackageTypeController {
	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN)
	@Get('/package-types')
	@ApiOperation({
		summary: 'Get All Package Type',
		description: `Only admin can use this API`,
	})
	@ApiDocsPagination('PackageTypes')
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
					sortField: 'name',
					sortOrder: 'asc',
				} as ListOptions<PackageType>,
			} as ListResponse<PackageType>,
		},
	})
	getAllPackageTypes(@Query() filter: ListOptions<PackageType>) {
		//
		console.log(filter);
	}

	@Public()
	@Get('/package-types/:packageTypeId')
	@ApiOperation({
		summary: 'Get Package Type by packageTypeId',
		description: `All role can use this API`,
	})
	@ApiParam({
		name: 'packageTypeId',
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
	getPackageType(@Param('packageTypeId') packageTypeId: string) {
		//
		console.log(packageTypeId);
	}

	@Public()
	@Get('facilities/:facilityId/package-types')
	@ApiOperation({
		summary: 'Get all Package Type by facilityId',
		description: `All role can use this API`,
	})
	@ApiDocsPagination('PackageTypes')
	@ApiParam({ name: 'facilityId', type: String, description: 'Facility ID' })
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
	getAllPackageTypeByFacility(
		@Param('facilityId') facilityId: string,
		@Query() filter: ListOptions<PackageType>,
	) {
		//
		console.log(facilityId, filter);
	}

	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN, UserRole.FACILITY_OWNER)
	@Post('facilities/:facilityId/package-types')
	@ApiOperation({
		summary: 'Create new Package Type by facilityId',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({ name: 'facilityId', type: String, description: 'Facility ID' })
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
	createPackageType(
		@Param('facilityId') id: string,
		@Body() data: CreatePackageTypeDto,
	) {
		console.log(id, data);
	}

	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN, UserRole.FACILITY_OWNER)
	@Patch('package-types/:packageTypeId')
	@ApiOperation({
		summary: 'Update Package Type by packageTypeId',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({
		name: 'packageTypeId',
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
	updatePackageType(
		@Param('packageTypeId') packageTypeId: string,
		@Body() data: UpdatePackageTypeDto,
	) {
		console.log(packageTypeId, data);
		// Logic để cập nhật package type theo ID
	}

	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN, UserRole.FACILITY_OWNER)
	@Delete('package-types/:packageTypeId')
	@ApiOperation({
		summary: 'Delete Package Type by packageTypeId',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({
		name: 'packageTypeId',
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
	deletePackageType(@Param('packageTypeId') packageTypeId: string) {
		console.log(packageTypeId);
		// Logic để xóa package type theo ID
	}

	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN, UserRole.FACILITY_OWNER)
	@Patch('facilities/:facilityId/package-types/swap-order')
	@ApiOperation({
		summary: 'Swap Package Type order by facilityId',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({ name: 'facilityId', type: String, description: 'Facility ID' })
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
	swapPackageTypeInList(
		@Param('facilityId') facilityId: string,
		@Body() data: UpdateOrderDto,
	) {
		console.log(facilityId, data);
		//Logic để hoán đổi order của 2 TackageType
	}
}
