import { BadRequestException, Controller, Delete, FileTypeValidator, Get, HttpException, HttpStatus, MaxFileSizeValidator, NotFoundException, Param, ParseFilePipe, Post, UnsupportedMediaTypeException, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiUnsupportedMediaTypeResponse } from '@nestjs/swagger';
import { Public } from '../auth/utils';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from './dto/file-upload-dto';
import { SuccessResponse } from 'src/shared/response/success-response';
import { ErrorResponse } from 'src/shared/response/common-response';
import { Photo } from './schemas/photo.schema';

@Controller('photo')
@ApiTags('photo')
export class PhotoController {

	// @ApiConsumes('multipart/form-data')
	@Post(':buckets/file')
	@ApiBearerAuth()
	@ApiParam({ name: 'buckets', type: String })
	@ApiOperation({
		summary: 'Add image into bucket',
		description: 'Add a image to bucket of a facility'
	})
	@ApiBody({
		type: FileUploadDto,
		examples: {
			example1: {
				value: {
					file: {},
					describe: 'describe'
                } as FileUploadDto,
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
					_id: '123456789',
					bucketID: 'id-bucket',
					name: 'name-image',
					linkURL: 'http://localhost:8080/id-bucket/name-image',
					createdAt: new Date(),
					updatedAt: new Date()
				} as Photo,
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: 'File size invalid!',
	})
	@ApiUnsupportedMediaTypeResponse({
		type: UnsupportedMediaTypeException,
		status: 415,
		description: 'File invalid!',
	})
	@UseInterceptors(FilesInterceptor('file'))
	upLoadFile() {

	}

	@Delete(':id')
	@ApiBearerAuth()
    @ApiOperation({
        summary: 'Delete image by id'
    })
    @ApiParam({ name: 'id', type: String, description: 'ID image' })
    @ApiResponse({
        status: 200,
        schema: {
            example: {
                code: 200,
                message: 'Success',
                data: null
            }
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
    @ApiNotFoundResponse({
		schema: {
			example: {
				code: '404',
				message: 'Photo not found!',
				details: null,
			} as ErrorResponse<null>,
		},
    })
    deleteImageByID() {

    }

}
