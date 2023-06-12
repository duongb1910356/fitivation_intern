import { BadRequestException, Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiOperation, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags, ApiBadRequestResponse } from '@nestjs/swagger';
import { Province } from './schemas/province.schema';
import { Public } from '../auth/utils';
import { ESortField } from 'src/shared/enum/sort.enum';

@Controller('address')
@ApiTags('address')
export class AddressController {

    @Public()
    @Get('province')
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
                            name: "Thành phố Cần Thơ",
                            code: 65
                        }
                    ],
                    total: 1,
                    options: {
                        limit: 1,
                        offet: 65,
                        search: 'string',
                        sortBy: 'code',
                        sortOrder: 'asc'
                    }
                }
            },
        },
    })
    @ApiNotFoundResponse({
        type: NotFoundException,
        status: 400,
        description: 'Can not get list of provinces!',
    })
    getAllProvince() {
    }

    @Public()
    @Get('province/:id/dictricts')
    @ApiOperation({
        summary: 'Get districts of province',
    })
    @ApiParam({ name: 'code', type: Number, description: 'Province code' })
    @ApiOkResponse({
        schema: {
            example: {
                code: 200,
                message: 'Success',
                data: {
                    items: [
                        {
                            name: "Phường Xuân Khánh",
                            code: 123
                        }
                    ],
                    total: 1,
                    options: {
                        limit: 1,
                        offet: 123,
                        search: 'string',
                        sortBy: 'code',
                        sortOrder: 'asc'
                    }
                }
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
                }
            }
        }
    })
    getDistrictsByProvinceCode(@Param('code') code: number) {
    }

    @Public()
    @Get('district/:id/communes')
    @ApiOperation({
        summary: 'Get commune of district',
    })
    @ApiParam({ name: 'code', type: Number, description: 'District code' })
    @ApiOkResponse({
        schema: {
            example: {
                code: 200,
                message: 'Success',
                data: {
                    items: [
                        {
                            name: "Quận Ninh Kiều",
                            code: 45
                        }
                    ],
                    total: 1,
                    options: {
                        limit: 1,
                        offet: 45,
                        search: 'string',
                        sortBy: 'code',
                        sortOrder: 'asc'
                    }
                }
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
                    code: 'Code invalid',
                }
            }
        }
    })
    getCommunesByDistrictCode(@Param('code') code: number) {

    }
}
