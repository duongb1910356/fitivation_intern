import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	FileTypeValidator,
	Get,
	MaxFileSizeValidator,
	NotFoundException,
	Param,
	ParseFilePipe,
	Post,
	UnsupportedMediaTypeException,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
	ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger';
import { Public } from '../auth/utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { ErrorResponse } from 'src/shared/response/common-response';
import { Photo } from './schemas/photo.schema';
import { PhotoService } from './photo.service';
import { CreatePhotoDto } from './dto/create-photo-dto';

@ApiTags('photo')
@Controller('photo')
export class PhotoController {
	constructor(private readonly photoService: PhotoService) {}

	@Post()
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Add image into folder of facility ',
		description: 'Add a image to folder of a facility',
	})
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
				describe: {
					type: 'string',
				},
				ownerID: {
					type: 'string',
				},
			},
		},
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
					updatedAt: new Date(),
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
	@UseInterceptors(FileInterceptor('file'))
	uploadFile(
		@Body() photoDto: CreatePhotoDto,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 1000 * 1000 }), // 1MB
					new FileTypeValidator({ fileType: /(?:jpeg|png)/i }),
				],
			}),
		)
		file: Express.Multer.File,
	) {
		return this.photoService.uploadFile(file, photoDto);
	}

	@Public()
	@Get(':id')
	@ApiOperation({
		summary: 'Get image by id',
	})
	@ApiParam({ name: 'id', type: String, description: 'Image ID' })
	async getPhoto(@Param('id') id: string) {
		console.log('chay controller photo');
		const photo = await this.photoService.findOne({ _id: id });
		if (!photo) {
			throw new NotFoundException('Photo not found');
		}
		return photo;
	}

	@Delete(':id')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Delete image by id',
	})
	@ApiParam({ name: 'id', type: String, description: 'ID image' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: null,
			},
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
	deleteImageByID(@Param('id') id) {
		return this.photoService.deleteOne(id);
	}
}
