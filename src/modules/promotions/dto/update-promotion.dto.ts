import { PartialType } from '@nestjs/swagger';
import { CreatePromotionDto } from './create-promotion.dto';

export class UpdateBillDto extends PartialType(CreatePromotionDto) {}
