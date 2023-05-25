import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { BaseObject } from '../../../shared/schemas/base-object.schema';
import { Review } from 'src/modules/reviews/schemas/reviews.schema';
import { Brand, BrandSchema } from './brand.schema';
import { Photo } from 'src/modules/photo/schemas/photo.schema';

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

export type FacilityDocument = HydratedDocument<Facility>;


@Schema({ timestamps: true })
export class Facility extends BaseObject {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true })
    brandID: Brand;

    // @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: 'FacilityCategory' }, required: true })
    // facilityCategoryID: FacilityCategory;

    // @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }, required: true })
    // ownerID: Account;

    @Prop({ required: true })
    name: string;

    @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
    address: {
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
    };

    @Prop({ default: '' })
    summary: string;

    @Prop({ default: '' })
    description: string;

    @Prop({ required: true, default: '' })
    coordinationLocation: string;

    @Prop({ enum: State, default: State.ACTIVE })
    state: State;

    @Prop({ enum: Status, default: Status.APPROVED })
    status: Status;

    @Prop({required: false, min: 0})
    averageStar: number;

    @Prop({
        type: [{ type: mongoose.Schema.Types.Mixed }],
        default: [],
        validate: {
            validator: function (array) {
                return array.length <= 5;
            },
            message: 'Array cannot have more than 5 elements',
        },
    })
    photos: Photo[];

    @Prop({
        type: [{ type: mongoose.Schema.Types.Mixed }],
        default: [],
        validate: {
            validator: function (array) {
                return array.length <= 5;
            },
            message: 'Array cannot have more than 5 elements',
        },
    })
    reviews: Review[];

    @Prop({ enum: ScheduleType, default: ScheduleType.WEEKLY })
    scheduleType: ScheduleType;
}

export const FacilitySchema = SchemaFactory.createForClass(Facility);