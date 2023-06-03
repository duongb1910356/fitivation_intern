import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CategoryType } from '../entities/facility-category';

export class CreateCategoryDto {
	@IsNotEmpty()
	@IsEnum(CategoryType)
	type: CategoryType;

	@IsNotEmpty()
	@IsString()
	name: string;
}
