import { IsString, IsNotEmpty} from 'class-validator';

export class ProvinceDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    code: string;
}
