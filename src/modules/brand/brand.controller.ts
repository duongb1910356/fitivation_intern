import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, BadRequestException, NotFoundException } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Public } from '../auth/utils';

@Controller('brands')
@ApiTags('brands')
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
        value: { name: 'String', photo: 'example.jpg' },
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    status: 200,
    schema: {
      example: {
        code: 200,
        message: 'Success',
        data: {
          brandID: '123456',
          accountID: '123456',
          name: 'City Gym',
          createAt: 'Date',
          updateAt: 'Date'
        },
      },
    },
  })
  @ApiBadRequestResponse({
    type: BadRequestException,
    status: 400,
    description: '[Input] invalid!',
  })
  @UseInterceptors(FilesInterceptor('files', 1))
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get lists brand or search Brand by name'
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'Name of Brand' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, example: 'name' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], example: 'asc' })
  @ApiOkResponse({
    status: 200,
    schema: {
      example: {
        code: 200,
        message: 'Success',
        data: {
          items: [
            {
              brandID: '123456',
              accountID: '123456',
              name: 'City Gym',
              createAt: 'Date',
              updateAt: 'Date'
            }
          ],
          total: 1,
          options: {
            limit: 1,
            offet: 1,
            search: 'string',
            sortBy: 'createAt',
            sortOrder: 'asc'
          }
        },
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
  findAll() {
    return this.brandService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Get infomation of a Brand'
  })
  @ApiQuery({ name: 'id', required: true, type: String, example: '123456' })
  @ApiOkResponse({
    status: 200,
    schema: {
      example: {
        code: 200,
        message: 'Success',
        data: {
          brandID: '123456',
          accountID: '123456',
          name: 'City Gym',
          createAt: 'Date',
          updateAt: 'Date'
        }
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
    summary: 'Modified Brand'
  })
  @ApiQuery({ name: 'id', required: true, type: String, example: '123456' })
  @ApiBody({
    type: UpdateBrandDto,
    examples: {
      example1: {
        value: { accountID: '123456', name: 'String', photo: 'example.jpg' },
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
          brandID: '123456',
          accountID: '123456',
          name: 'City Gym',
          createAt: 'Date',
          updateAt: 'Date'
        }
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
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(+id, updateBrandDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Delete Brand'
  })
  @ApiQuery({ name: 'id', required: true, type: String, example: '123456' })
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
  @ApiBadRequestResponse({
    type: BadRequestException,
    status: 400,
    description: '[Input] invalid'
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandService.remove(+id);
  }
}
