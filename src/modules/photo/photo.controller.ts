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

@ApiTags('photo')
@Controller('photo')
export class PhotoController {
	constructor(private readonly photoService: PhotoService) { }

	// @ApiBearerAuth()
	// @ApiParam({ name: 'ownerID', type: String })
	// @ApiOperation({
	// 	summary: 'Add image into folder of facility ',
	// 	description: 'Add a image to folder of a facility'
	// })
	// @ApiBody({
	// 	type: FileUploadDto,
	// 	examples: {
	// 		example1: {
	// 			value: {
	// 				file: {},
	// 				describe: 'describe'
	// 			} as FileUploadDto,
	// 		}
	// 	}
	// })
	// @ApiOkResponse({
	// 	status: 200,
	// 	schema: {
	// 		example: {
	// 			code: 200,
	// 			message: 'Success',
	// 			data: {
	// 				_id: '123456789',
	// 				ownerID: 'id-bucket',
	// 				name: 'name-image',
	// 				imageURL: 'http://localhost:8080/id-bucket/name-image',
	// 				createdAt: new Date(),
	// 				updatedAt: new Date()
	// 			} as Photo,
	// 		},
	// 	},
	// })
	// @ApiBadRequestResponse({
	// 	type: BadRequestException,
	// 	status: 400,
	// 	description: 'File size invalid!',
	// })
	// @ApiUnsupportedMediaTypeResponse({
	// 	type: UnsupportedMediaTypeException,
	// 	status: 415,
	// 	description: 'File invalid!',
	// })

	@Public()
	@Post(':ownerID/file')
	@UseInterceptors(FileInterceptor('file'))
	uploadFile(@UploadedFile() file: Express.Multer.File): { filename: string } {
		// Xử lý file tại đây (lưu, xử lý dữ liệu, ...)
		// Sau khi xử lý thành công, trả về tên file
		console.log("file.filename >> ", file.originalname)
		return { filename: file.originalname };
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
