import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsUrl } from 'class-validator';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { Facility } from 'src/modules/facility/schemas/facility.schema';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export type ReviewDocument = HydratedDocument<Review>;

@Schema()
export class Review extends BaseObject {
    // @Prop({
    //     required: true,
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Account',
    // })
    // accountID: Account;

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

    @Prop({ type: [String], required: true })
    @IsUrl()
    linkURLs: string[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

// @Schema()
// export class Facility extends Document {
//   // ...

//   @Prop({ type: [Review], default: [] })
//   reviews: Review[];
// }

// export const FacilitySchema = SchemaFactory.createForClass(Facility);
