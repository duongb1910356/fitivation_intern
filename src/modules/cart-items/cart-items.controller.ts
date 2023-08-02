import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CartItemsService } from './cart-items.service';

@Controller('cart-items')
@ApiTags('cart-items')
export class CartItemsController {
	constructor(private readonly cartItemsService: CartItemsService) {}
}
