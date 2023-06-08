import { MongooseModule } from '@nestjs/mongoose';
import { seeder } from 'nestjs-seeder';
import { appConfig } from './app.config';
import { User, UserSchema } from './modules/users/schemas/user.schema';
import { UserSeeder } from './seeder/user-seeder';
import { Province, ProvinceSchema } from './modules/address/schemas/province.schema';
import { ProvinceSeeder } from './seeder/province-seeder';
import { District, DistrictSchema } from './modules/address/schemas/district.schema';
import { Commune, CommuneSchema } from './modules/address/schemas/commune.schema';

seeder({
	imports: [
		MongooseModule.forRoot(appConfig.mongoURI),
		// MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		MongooseModule.forFeature([{ name: Province.name, schema: ProvinceSchema }]),
		MongooseModule.forFeature([{ name: District.name, schema: DistrictSchema }]),
		MongooseModule.forFeature([{ name: Commune.name, schema: CommuneSchema }])
	],
}).run([ProvinceSeeder]);
