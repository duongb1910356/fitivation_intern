import { ApiProperty } from '@nestjs/swagger';
import { CreateCartDto } from './create-cart.dto';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class PurchaseCartDto extends CreateCartDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accountID: string;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  cartItemIDs: object[];

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  @IsOptional()
  promotionsIDs?: object[];

  @ApiProperty()
  @IsNumber()
  promotionPrice: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  totalPrice: number;
}
