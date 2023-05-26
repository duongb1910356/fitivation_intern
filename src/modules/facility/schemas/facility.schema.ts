import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { BaseObject } from '../../../shared/schemas/base-object.schema';
import { Review, ReviewSchema } from 'src/modules/reviews/schemas/reviews.schema';
import { Brand, BrandSchema } from '../../brand/schemas/brand.schema';
import { Photo, PhotoSchema } from 'src/modules/photo/schemas/photo.schema';

enum State {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

enum Status {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

enum ScheduleType {
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
}

interface Address {
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
    facilityCategoryID: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true })
    ownerID: string;

    @Prop({ type: String, required: true })
    name: string;

    @Prop({type: Object, required: true })
    address: Address

    @Prop({ default: '' })
    summary: string;

    @Prop({ default: '' })
    description: string;

    @Prop({ type: [Number], required: true, default: [] })
    coordinationLocation: [number, number];

    @Prop({ enum: State, default: State.ACTIVE })
    state: State;

    @Prop({ enum: Status, default: Status.APPROVED })
    status: Status;

    @Prop({ required: false, min: 0 })
    averageStar: number;

    @Prop({
        type: [PhotoSchema],
        default: [],
    })
    photos: Photo[];

    @Prop({
        type: [ReviewSchema],
        default: [],
    })
    reviews: Review[];

    @Prop({ enum: ScheduleType, default: ScheduleType.WEEKLY })
    scheduleType: ScheduleType;
}

export const FacilitySchema = SchemaFactory.createForClass(Facility);