import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { BaseObject } from '../../../shared/schemas/base-object.schema';
import { Review, ReviewSchema } from 'src/modules/reviews/schemas/reviews.schema';
import { Brand, BrandSchema } from '../../brand/schemas/brand.schema';
import { Photo, PhotoSchema } from 'src/modules/photo/schemas/photo.schema';
import { FacilityCategory } from 'src/modules/facility-category/entities/facility-category';
import { User } from 'src/modules/users/schemas/user.schema';
import { State, Status, ScheduleType  } from '../../../shared/enum/facility.enum';

export interface Address {
    province: {
        name: string;
        code: number;
    };
    district: {
        name: string;
        code: number;
    };
    commune: {
        name: string;
        code: number;
    };
}

export type FacilityDocument = HydratedDocument<Facility>;

@Schema({ timestamps: true })
export class Facility extends BaseObject {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true })
    brandID: Brand;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'FacilityCategory', required: true })
    facilityCategoryID: FacilityCategory;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    ownerID: User;

    @Prop({ type: String, required: true })
    name: string;

    @Prop({type: Object, required: true })
    address: Address

    @Prop({ default: ''})
    summary: string;

    @Prop({ default: ''})
    description: string;

    @Prop({ type: [Number], required: false, default: [] })
    coordinationLocation: [number, number];

    @Prop({ enum: State, default: State.ACTIVE })
    state: State;

    @Prop({ enum: Status, default: Status.APPROVED })
    status: Status;

    @Prop({ required: false, min: 0 })
    averageStar: number;

    @Prop({
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Photo', required: true}],
        validate: {
            validator: (photos: any[]) => photos.length <= 5,
            message: 'Facility have 5 photo latest'
        },
        default: [],
    })
    photos: Photo[];

    @Prop({
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review', required: false}],
        validate: {
            validator: (reviews: any[]) => reviews.length <= 5,
            message: 'Facility have 5 reviews latest'
        },
        default: [],
    })
    reviews: Review[];

    @Prop({ enum: ScheduleType, default: ScheduleType.WEEKLY })
    scheduleType: ScheduleType;
}

export const FacilitySchema = SchemaFactory.createForClass(Facility);