import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { CreateFacilityDto } from './create-facility-dto';
import { Review } from 'src/modules/reviews/schemas/reviews.schema';
import { ScheduleType, State, Status } from 'src/shared/enum/facility.enum';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateFacilityDto extends PartialType(
    PickType(CreateFacilityDto, [
        'brandID',
        'facilityCategoryID',
        'name',
        'address',
        'summary',
        'description',
        'coordinatesLocation',
        'photos',
        'scheduleType',
        'state']),
) {
}
