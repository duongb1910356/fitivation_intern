import { ApiProperty } from '@nestjs/swagger';

// export class ReviewDto {
// 	@IsEmail()
// 	@ApiProperty({ description: 'User email', example: 'test1@test.com' })
// 	email: string;

// 	@MinLength(6)
// 	@ApiProperty({ description: 'User password', example: '123123123' })
// 	password: string;
// }

import { IsNotEmpty, IsNumber, Min, Max, IsArray, IsString, ArrayNotEmpty, Validate } from 'class-validator';
import { isURL } from 'class-validator';

export class ReviewDto {
    @IsString()
    idFacility: String;

    @IsString()
    idAccount: String;

    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @IsNotEmpty()
    @IsString()
    comment: string;

    @IsArray()
    @Validate(isURL, { each: true })
    linkURL: string[];
}

