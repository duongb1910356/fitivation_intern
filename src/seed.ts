import { MongooseModule } from '@nestjs/mongoose';
import { seeder } from 'nestjs-seeder';
import { appConfig } from './app.config';
import { User, UserSchema } from './modules/users/schemas/user.schema';
import { UserSeeder } from './seeder/user-seeder';

seeder({
	imports: [
		MongooseModule.forRoot(appConfig.mongoURI),
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
	],
}).run([UserSeeder]);
