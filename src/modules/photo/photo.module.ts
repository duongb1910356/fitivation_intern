import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Photo, PhotoSchemaFactory } from './schemas/photo.schema';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
import { PhotoRepository } from './repositories/photo.repository';

@Module({
	imports: [
		// MongooseModule.forFeature([{ name: Photo.name, schema: PhotoSchema }]),
		MongooseModule.forFeatureAsync([
			{
				name: Photo.name,
				useFactory: PhotoSchemaFactory,
				inject: [],
				imports: [],
			},
		]),
	],
	providers: [
		PhotoService,
		{ provide: 'PhotoRepository', useClass: PhotoRepository },
	],
	exports: [PhotoService],
	controllers: [PhotoController],
})
export class PhotoModule {}
