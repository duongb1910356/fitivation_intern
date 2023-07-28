import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { CartsModule } from '../carts/carts.module';
import { PhotoModule } from '../photo/photo.module';
import { StripeModule } from 'nestjs-stripe';
import { appConfig } from 'src/app.config';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		StripeModule,
		CartsModule,
		PhotoModule,
		StripeModule.forRoot({
			apiKey: `${appConfig.stripeSecretKey}`,
			apiVersion: '2022-11-15',
		}),
	],
	providers: [UsersService],
	exports: [UsersService],
	controllers: [UsersController],
})
export class UsersModule {}
