import { BadRequestException, Body, Controller, Delete, FileTypeValidator, Get, HttpException, HttpStatus, MaxFileSizeValidator, NotFoundException, Param, ParseFilePipe, Post, UnsupportedMediaTypeException, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiUnsupportedMediaTypeResponse } from '@nestjs/swagger';
import { Public } from '../auth/utils';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from './dto/file-upload-dto';
import { SuccessResponse } from 'src/shared/response/success-response';
import { ErrorResponse } from 'src/shared/response/common-response';
import { Photo } from './schemas/photo.schema';
import { GenFileName } from 'src/utils/gen-filename';
import { appConfig } from 'src/app.config';
import { mkdirSync, writeFileSync } from 'fs';
import { PhotoService } from './photo.service';
import { CreatePhotoDto } from './dto/create-photo-dto';
import { Types } from 'mongoose';

@ApiTags('photo')
@Controller('photo')
export class PhotoController {
	constructor(private readonly photoService: PhotoService) { }

	@Public()
	@Post()
	@UseInterceptors(FileInterceptor('file'))
	@ApiOperation({
		summary: 'Add image into folder of facility ',
		description: 'Add a image to folder of a facility'
	})
	@ApiBody({
		type: CreatePhotoDto,
		examples: {
			example1: {
				value: {
					ownerID: '6475692ce552996bd0014c94',
					describe: 'image 1'
				} as CreatePhotoDto,
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
					ownerID: 'ownerID',
					name: 'name-image',
					imageURL: 'http://localhost:8080/ownerID/name-image',
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
	uploadFile(
		@Body() photoDto: CreatePhotoDto,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 1000 * 1000 }), // 1MB
					new FileTypeValidator({ fileType: /(?:jpeg|png)/i }),
				],
			}),
		) file: Express.Multer.File
	) {
		return this.photoService.uploadFile(file, photoDto);
	}

	@Public()
	@Post('test')
	@UseInterceptors(FileInterceptor('file'))
	createPhoto(
		@Body() createPhotoDto: CreatePhotoDto,
		@UploadedFile() file: Express.Multer.File
	): CreatePhotoDto {
		console.log("File >> ", createPhotoDto)
		return createPhotoDto;
	}

	@Public()
	@Get('test/:id')
	getPhoto(@Param('id') id: string) {
		return this.photoService.findOne({ _id: id })
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
