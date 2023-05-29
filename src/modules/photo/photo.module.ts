import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Photo, PhotoSchema } from './schemas/photo.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Photo.name, schema: PhotoSchema }]),
    ],
})
export class PhotoModule {}
