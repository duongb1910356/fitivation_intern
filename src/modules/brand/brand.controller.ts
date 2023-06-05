import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, BadRequestException, NotFoundException } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Public } from '../auth/utils';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import { ErrorResponse, ListOptions, ListResponse } from 'src/shared/response/common-response';
import { Brand } from './schemas/brand.schema';
import { User } from '../users/schemas/user.schema';

@ApiTags('brands')
@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) { }

  @Post()
  @ApiOperation({
    summary: 'Create a new brand'
  })
  @ApiBody({
    type: CreateBrandDto,
    examples: {
      example1: {
        value: {
          name: 'string'
        } as CreateBrandDto,
      }
    }
  })
  @ApiOkResponse({
    status: 200,
    schema: {
      example: {
        code: 200,
        message: 'Success',
        data: {
          accountID: {},
          name: 'City Gym',
          createdAt: new Date(),
          updatedAt: new Date()
        } as Brand,
      },
    },
  })
  @ApiBadRequestResponse({
    type: BadRequestException,
    status: 400,
    description: '[Input] invalid!',
  })
  createBrand() {
    // return this.brandService.create(createBrandDto);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get list of Brand'
  })
  @ApiDocsPagination('Brand')
  @ApiOkResponse({
    status: 200,
    schema: {
      example: {
        items: [
          {
            _id: '123456',
            accountID: {} as unknown as User,
            name: 'City Gym',
            createdAt: new Date(),
            updatedAt: new Date()
          } as Brand
        ],
        total: 1,
        options: {
          limit: 5,
          offset: 5,
          searchField: 'createdAt',
          searchValue: 'string',
          sortField: 'createdAt',
          sortOrder: 'desc',
        } as ListOptions<Brand>
      } as ListResponse<Brand>,
    },
  })
  @ApiNotFoundResponse({
    type: NotFoundException,
    status: 404,
    description: 'Brands not found!',
  })
  @ApiBadRequestResponse({
    type: BadRequestException,
    status: 400,
    description: '[Input] invalid'
  })
  findAll() {
    return this.brandService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Get infomation of a brand'
  })
  @ApiQuery({ name: 'id', required: true, type: String, example: '123456' })
  @ApiOkResponse({
    status: 200,
    schema: {
      example: {
        _id: '123456',
        accountID: '123456',
        name: 'City Gym',
        createAt: new Date(),
        updateAt: new Date()
      },
    },
  })
  @ApiNotFoundResponse({
    type: NotFoundException,
    status: 404,
    description: 'Brands not found!',
  })
  @ApiBadRequestResponse({
    type: BadRequestException,
    status: 400,
    description: '[Input] invalid'
  })
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Modified brand'
  })
  @ApiParam({ name: 'id', type: String, description: 'id brand' })
  @ApiBody({
    type: UpdateBrandDto,
    examples: {
      example1: {
        value: { name: 'String' } as UpdateBrandDto,
      }
    }
  })
  @ApiOkResponse({
    status: 200,
    schema: {
      example: {
        code: 200,
        message: 'Success',
        data: {
          accountID: {},
          name: 'City Gym',
          createdAt: new Date(),
          updatedAt: new Date()
        } as Brand
      },
    },
  })
  @ApiNotFoundResponse({
    type: NotFoundException,
    status: 404,
    description: 'Brands not found!',
  })
  @ApiBadRequestResponse({
    type: BadRequestException,
    status: 400,
    description: '[Input] invalid'
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
  updateBrand(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String, description: 'id brand' })
  @ApiOkResponse({
    status: 200,
    schema: {
      example: {
        code: 200,
        message: 'Success',
        data: null
      },
    },
  })
  @ApiNotFoundResponse({
    type: NotFoundException,
    status: 404,
    description: 'Brands not found!',
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
  deleteBrand(@Param('id') id: string) {
  }
}
