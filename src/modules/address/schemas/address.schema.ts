import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Address {
    @Prop({ type: String, required: true })
    street: string;

    @Prop({ type: String, required: true })
    city: string;

    @Prop({ type: String, required: true })
    province: string;

    @Prop({ type: String, required: true })
    district: string;
}

export type AddressDocument = Address & Document;
export const AddressSchema = SchemaFactory.createForClass(Address);
