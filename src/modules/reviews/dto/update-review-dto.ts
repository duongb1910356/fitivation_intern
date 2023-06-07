import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Review } from 'src/modules/reviews/schemas/reviews.schema';
import { ScheduleType, State, Status } from 'src/shared/enum/facility.enum';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateReviewDto } from './create-review-dto';
import { OmitType } from '@nestjs/mapped-types';

export class UpdateReviewDto extends PartialType(
    OmitType(CreateReviewDto, ['facilityID']),
) {
    
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    deletedImages?: string[];

}
