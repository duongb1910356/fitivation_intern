import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import {
	ApiOperation,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiParam,
	ApiTags,
	ApiBadRequestResponse,
} from '@nestjs/swagger';
import { Public } from '../auth/utils';
import { AddressService } from './address.service';

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
							_id: '6487e697bb9d2d75b7a91c14',
							name: 'Thành phố Hà Nội',
							code: '01',
							__v: 0,
							createdAt: '2023-06-13T03:46:31.282Z',
							updatedAt: '2023-06-13T03:46:31.282Z',
						},
						{
							_id: '6487e697bb9d2d75b7a91e76',
							name: 'Tỉnh Hà Giang',
							code: '02',
							__v: 0,
							createAt: '2023-06-13T03:46:31.282Z',
							updatedAt: '2023-06-13T03:46:31.282Z',
						},
					],
					total: 1,
					options: {},
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
							_id: '6487e697bb9d2d75b7a947c4',
							name: 'Thành phố Bạc Liêu',
							code: '954',
							province: '6487e697bb9d2d75b7a947c3',
							__v: 0,
							createdAt: '2023-06-13T03:46:31.413Z',
							updatedAt: '2023-06-13T03:46:31.413Z',
						},
						{
							_id: '6487e697bb9d2d75b7a947cf',
							name: 'Huyện Hồng Dân',
							code: '956',
							province: '6487e697bb9d2d75b7a947c3',
							__v: 0,
							createdAt: '2023-06-13T03:46:31.413Z',
							updatedAt: '2023-06-13T03:46:31.413Z',
						},
					],
					total: 1,
					options: {
						limit: 2,
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
							_id: '6487e697bb9d2d75b7a947c5',
							name: 'Phường 2',
							code: '31813',
							district: '6487e697bb9d2d75b7a947c4',
							__v: 0,
							createdAt: '2023-06-13T03:46:32.075Z',
							updatedAt: '2023-06-13T03:46:32.075Z',
						},
						{
							_id: '6487e697bb9d2d75b7a947c6',
							name: 'Phường 3',
							code: '31816',
							district: '6487e697bb9d2d75b7a947c4',
							__v: 0,
							createdAt: '2023-06-13T03:46:32.075Z',
							updatedAt: '2023-06-13T03:46:32.075Z',
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
