// province.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

@Schema({timestamps: false})
export class Province extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  code: number;
}

@Schema({timestamps: false})
export class District extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  code: number;

  @Prop({ type: Province, required: true })
  province: Province;
}

@Schema({timestamps: false})
export class Commune extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  code: number;

  @Prop({ type: District, required: true })
  district: District;
}

export const ProvinceSchema = SchemaFactory.createForClass(Province);
export const DistrictSchema = SchemaFactory.createForClass(District);
export const CommuneSchema = SchemaFactory.createForClass(Commune);

// @Schema({ timestamps: false })
// export class Province extends BaseObject {
//     @Prop({ required: true, unique: true })
//     name: string;

//     @Prop({ required: true })
//     code: number;

//     @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'District' }], required: true })
//     districts: District[];
// }

// export const ProvinceSchema = SchemaFactory.createForClass(Province);
// ProvinceSchema.index({ code: 1, codename: 1 });

// @Schema({ timestamps: false })
// export class District extends BaseObject {
//     @Prop({ required: true })
//     name: string;

//     @Prop({ required: true })
//     code: number;

//     @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Commune' }], required: true })
//     communes: Commune[];
// }
// export const DistrictSchema = SchemaFactory.createForClass(District);

// @Schema({ timestamps: false })
// export class Commune extends BaseObject {
//     @Prop({ required: true })
//     name: string;

//     @Prop({ required: true })
//     code: number;
// }
// export const CommuneSchema = SchemaFactory.createForClass(Commune);


// interface Address {
//     name: string;
//     code: number;
// }

// @Schema()
// export class AddressDocument extends Document {
//     @Prop({ required: true })
//     province: Address;

//     @Prop({ required: true })
//     district: Address;

//     @Prop({ required: true })
//     ward: Address;
// }

// export const AddressSchema = SchemaFactory.createForClass(AddressDocument);

