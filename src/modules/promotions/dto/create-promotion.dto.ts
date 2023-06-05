import {
	IsNotEmpty,
	IsString,
	IsNumber,
	IsEnum,
	IsArray,
	IsOptional,
	ArrayNotEmpty,
	ArrayMinSize,
	IsPositive,
	MinLength,
	MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePromotionDto {}
