import { BadRequestException, Controller, FileTypeValidator, Get, HttpException, HttpStatus, MaxFileSizeValidator, NotFoundException, Param, ParseFilePipe, Post, UnsupportedMediaTypeException, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnsupportedMediaTypeResponse } from '@nestjs/swagger';
import { Public } from '../auth/utils';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from './dto/file-upload-dto';
import { SuccessResponse } from 'src/shared/response/success-response';

@Controller('photo')
@ApiTags('photo')
export class PhotoController {

	@Post(':ownerid/file')
	@ApiParam({ name: 'ownerid', type: String })
	@ApiOperation({
		summary: 'Upload files to a local server with a maximum of 5 files',
	})
	@UseInterceptors(FilesInterceptor('files', 5))
	@ApiBody({ type: FileUploadDto})
	@ApiConsumes('multipart/form-data')
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					ownerID: '6475692ce552996bd0014c94',
					link: 'http://localhost:8080/6475692ce552996bd0014c94/1685416428374-266420883.jpeg',
				},
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
	upLoadFile(
		@Param('ownerid') ownerid,
		@UploadedFiles(
			// new ParseFilePipe({
			// 	validators: [
			// 		new MaxFileSizeValidator({ maxSize: 1000 * 1000 }), // 1MB
			// 		new FileTypeValidator({ fileType: /(?:jpeg|png)/i }),
			// 	],
			// }),
		)
		files: Express.Multer.File[]) {
		if (!files || files.length === 0) {
			throw new HttpException('No images uploaded', HttpStatus.BAD_REQUEST);
		}
	}



	// @Public()
	// @Get('province')
	// @ApiOperation({
	//     summary: 'Get list of provinces',
	// })
	// fdbdfbf(){

	// }

}
