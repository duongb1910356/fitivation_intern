import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { createReadStream, createWriteStream, existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { appConfig } from 'src/app.config';
import { GenFileName } from 'src/utils/gen-filename';
import { Photo, PhotoDocument } from './schemas/photo.schema';
import { Model } from 'mongoose';
import { CreatePhotoDto } from './dto/create-photo-dto';
import { Request } from 'express';

@Injectable()
export class PhotoService {
	constructor(@InjectModel(Photo.name) private photoModel: Model<PhotoDocument>) {}

    uploadFile(file: Express.Multer.File, photoDto: CreatePhotoDto): Promise<Photo> {
        try {
            const dir = `${appConfig.fileRoot}/${photoDto.ownerID}`;
            if (!existsSync(dir)) {
                mkdirSync(dir, { recursive: true });
            }
            const fileName = GenFileName.gen(file.mimetype);
            writeFileSync(`${dir}/${fileName}`, file.buffer);
            const input: CreatePhotoDto = {
                ownerID: photoDto.ownerID,
                name: fileName,
                describe: photoDto.describe
            }
            return this.photoModel.create(input);
        } catch (error) {
            throw new Error('Uploading failed');
        }
    }

    async findOne(filter: Partial<Photo>): Promise<Photo> {
		return this.photoModel.findOne(filter);
	}

}
