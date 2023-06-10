import { Module } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';

@Module({
	providers: [PromotionsService],
	exports: [PromotionsService],
	controllers: [PromotionsController],
})
export class PromotionsModule {}
