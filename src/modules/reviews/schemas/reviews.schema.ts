import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsUrl } from 'class-validator';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { Facility } from 'src/modules/facility/schemas/facility.schema';
import { Photo, PhotoSchema } from 'src/modules/photo/schemas/photo.schema';
import { User } from 'src/modules/users/schemas/user.schema';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export type ReviewDocument = HydratedDocument<Review>;

@Schema()
export class Review extends BaseObject {
    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    })
    accountID: User;

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility',
    })
    facilityID: Facility;

    @Prop({ required: true, min: 1, max: 5 })
    rating: number;

    @Prop({ required: true, default: '' })
    comment: string;

    // @Prop({ type: [String], required: false, default: [] })
    // @IsUrl()
    // linkURLs: string[];

    //Review chỉ chứa tối đa 5 ảnh, embedd ảnh vào reviews
    @Prop({ type: [PhotoSchema], required: false, default: [] })
    photos: Photo[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);