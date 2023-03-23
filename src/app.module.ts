import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { appConfig } from './app.config';
import { AppLoggerMiddleware } from './common/middlewares/logging.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    // Make it look good and work well
    MongooseModule.forRoot(appConfig.mongoURI),
    AuthModule,
    UsersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }

  constructor() {
    console.log({ appConfig });
  }
}
