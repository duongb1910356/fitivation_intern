import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { createReadStream, createWriteStream, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { appConfig } from 'src/app.config';
import { GenFileName } from 'src/utils/gen-filename';

@Injectable()
export class PhotoService {
    // constructor()

    uploadFile(file: Express.Multer.File, ownerID: String): String {
        try {
            if (!file) {
                console.log("File empty");
            }
            // const dir = `${appConfig.fileRoot}/${ownerID}`;
            // const fileName = GenFileName.gen(file.mimetype);
            // mkdirSync(dir, { recursive: true });
            // writeFileSync(`${dir}/${fileName}`, file.buffer);
            return file.filename
        } catch (error) {
            unlinkSync(file.path);
            console.log("Error: Uploadfile >> ", error);
            throw new Error('Lỗi khi tải lên ảnh');
        }

    }

}
