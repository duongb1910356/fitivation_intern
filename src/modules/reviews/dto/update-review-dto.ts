import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Review } from 'src/modules/reviews/schemas/reviews.schema';
import { ScheduleType, State, Status } from 'src/shared/enum/facility.enum';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateReviewDto } from './create-review-dto';

export class UpdateReviewDto extends PartialType(
    PickType(CreateReviewDto, ['facilityID']),
) {
    
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    deletedImages?: string[];

}
