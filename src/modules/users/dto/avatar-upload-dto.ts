import { IsString } from 'class-validator';

export class AvatarUploadDto {
	@IsString()
	avatar: any;
}
