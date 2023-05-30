import { Controller, Get, Query } from '@nestjs/common';
import { filter } from 'rxjs';

@Controller('reviews')
export class ReviewsController {

    @Get()
    getAllReviews(@Query() filter:{usId?:string, faId?:string}){
        
    }
}