import { MongooseModule } from '@nestjs/mongoose';
import { seeder } from 'nestjs-seeder';
import { appConfig } from './app.config';

import {
	Province,
	ProvinceSchema,
} from './modules/address/schemas/province.schema';
import { AdministrativeUnitSeeder } from './seeder/administrative-unit-seeder';
import {
	District,
	DistrictSchema,
} from './modules/address/schemas/district.schema';
import {
	Commune,
	CommuneSchema,
} from './modules/address/schemas/commune.schema';
import { Brand, BrandSchema } from './modules/brand/schemas/brand.schema';
import { BrandSeeder } from './seeder/brand-seeder';
import { FacilitySeeder } from './seeder/facility-seeder';
import {
	Facility,
	FacilitySchema,
} from './modules/facility/schemas/facility.schema';
import { ReviewSeeder } from './seeder/review-seeder';
import { Review, ReviewSchema } from './modules/reviews/schemas/reviews.schema';
import { PhotoSeeder } from './seeder/photo-seeder';
import { CategorySeeder } from './seeder/category-seeder';
import {
	FacilityCategory,
	FacilityCategorySchema,
} from './modules/facility-category/entities/facility-category';
import { Photo, PhotoSchema } from './modules/photo/schemas/photo.schema';
import {
	FacilitySchedule,
	FacilityScheduleSchema,
} from './modules/facility-schedule/entities/facility-schedule.entity';
import { ScheduleSeeder } from './seeder/schedule-seeder';
import {
	Counter,
	CounterSchema,
} from './modules/counter/entities/counter.entity';
import {
	PackageType,
	PackageTypeSchema,
} from './modules/package-type/entities/package-type.entity';
import { CounterSeeder } from './seeder/counter-seeder';
import { PackageSeeder } from './seeder/package-seeder';
import { PackageTypeSeeder } from './seeder/package-type-seeder';
import {
	Package,
	PackageSchema,
} from './modules/package/entities/package.entity';
import { UserSeeder } from './seeder/user-seeder';
import { User, UserSchema } from './modules/users/schemas/user.schema';

seeder({
	imports: [
		MongooseModule.forRoot(appConfig.mongoURI),
		MongooseModule.forFeature([
			{ name: Province.name, schema: ProvinceSchema },
		]),
		MongooseModule.forFeature([
			{ name: District.name, schema: DistrictSchema },
		]),
		MongooseModule.forFeature([{ name: Commune.name, schema: CommuneSchema }]),
		MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]),
		MongooseModule.forFeature([
			{ name: Facility.name, schema: FacilitySchema },
		]),
		MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
		MongooseModule.forFeature([
			{ name: FacilityCategory.name, schema: FacilityCategorySchema },
		]),
		MongooseModule.forFeature([{ name: Photo.name, schema: PhotoSchema }]),
		MongooseModule.forFeature([
			{ name: FacilitySchedule.name, schema: FacilityScheduleSchema },
		]),
		MongooseModule.forFeature([{ name: Counter.name, schema: CounterSchema }]),
		MongooseModule.forFeature([
			{ name: PackageType.name, schema: PackageTypeSchema },
		]),
		MongooseModule.forFeature([{ name: Package.name, schema: PackageSchema }]),
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
	],
}).run([
	AdministrativeUnitSeeder,
	BrandSeeder,
	FacilitySeeder,
	CategorySeeder,
	ReviewSeeder,
	PhotoSeeder,
	ScheduleSeeder,
	CounterSeeder,
	PackageSeeder,
	PackageTypeSeeder,
	UserSeeder,
]);
