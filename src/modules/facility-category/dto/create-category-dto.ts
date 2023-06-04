import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
	@IsNotEmpty()
	@IsString()
	type: string;

	@IsNotEmpty()
	@IsString()
	name: string;
}
