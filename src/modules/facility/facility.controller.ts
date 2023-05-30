import { Controller, Get, Param } from '@nestjs/common';
import { ReviewsController } from '../reviews/reviews.controller';

@Controller('facility')
export class FacilityController {
	constructor(private readonly ReviewsController: ReviewsController) {}

    @Get(":id")
    getAllReviews(@Param("id") id:string){
        this.ReviewsController.getAllReviews({faId:id})
    }
}
