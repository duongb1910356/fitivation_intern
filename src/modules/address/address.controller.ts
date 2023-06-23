import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import {
	ApiOperation,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiParam,
	ApiTags,
	ApiBadRequestResponse,
} from '@nestjs/swagger';
import { AddressService } from './address.service';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('address')
@Controller('address')
export class AddressController {
	constructor(private readonly addressService: AddressService) {}

	@Public()
	@Get('provinces')
	@ApiOperation({
		summary: 'Get list of provinces',
	})
	@ApiOkResponse({
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					items: [
						{
							name: 'Thành phố Cần Thơ',
							code: 65,
						},
					],
					total: 1,
					options: {
						limit: 1,
						offet: 65,
						search: 'string',
						sortBy: 'code',
						sortOrder: 'asc',
					},
				},
			},
		},
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 400,
		description: 'Can not get list of provinces!',
	})
	getAllProvince() {
		return this.addressService.findAllProvince();
	}

	@Public()
	@Get('province/:id/districts')
	@ApiOperation({
		summary: 'Get districts of province',
	})
	@ApiParam({ name: 'id', type: String, description: 'Province id' })
	@ApiOkResponse({
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					items: [
						{
							name: 'Phường Xuân Khánh',
							code: 123,
						},
					],
					total: 1,
					options: {
						limit: 1,
						offet: 123,
						search: 'string',
						sortBy: 'code',
						sortOrder: 'asc',
					},
				},
			},
		},
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 400,
		description: 'Districts of province not found!',
	})
	@ApiBadRequestResponse({
		schema: {
			example: {
				code: 404,
				message: '[Input] not valid',
				details: {
					code: 'Code invalid',
				},
			},
		},
	})
	getDistrictsByProvinceCode(@Param('id') id: string) {
		return this.addressService.findDistrictsByProvinceID(id);
	}

	@Public()
	@Get('district/:id/communes')
	@ApiOperation({
		summary: 'Get commune of district',
	})
	@ApiParam({ name: 'id', type: String, description: 'District id' })
	@ApiOkResponse({
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					items: [
						{
							name: 'Quận Ninh Kiều',
							code: 45,
						},
					],
					total: 1,
					options: {
						limit: 1,
						offet: 45,
						search: 'string',
						sortBy: 'code',
						sortOrder: 'asc',
					},
				},
			},
		},
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 400,
		description: 'Communes of District not found!',
	})
	@ApiBadRequestResponse({
		schema: {
			example: {
				code: 404,
				message: '[Input] not valid',
				details: {
					code: 'Id invalid',
				},
			},
		},
	})
	getCommunesByDistrictCode(@Param('id') id: string) {
		return this.addressService.findCommunesByDistrictID(id);
	}
}
