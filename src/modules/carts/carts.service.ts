import { Injectable } from '@nestjs/common';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CartsService {
	constructor(@InjectModel(Cart.name) private userModel: Model<CartDocument>) {}
}
