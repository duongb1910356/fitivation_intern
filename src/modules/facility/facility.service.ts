import { Inject, Injectable } from '@nestjs/common';
import { BaseServiceAbstract } from 'src/shared/services/base-abstract.service';
import { Facility } from './schemas/facility.schema';
import { FacilityRepository } from './repositories/facility.repository';
import { PhotoService } from '../photo/photo.service';
import { CreateFacilityDto } from './dto/create-facility-dto';
import { generateUniqueId } from 'src/utils/gen-uid';
import { ReviewService } from '../reviews/reviews.service';
import { CreateReviewDto } from '../reviews/dto/create-review-dto';

@Injectable()
export class FacilityService extends BaseServiceAbstract<Facility> {
	constructor(
		@Inject('FacilityRepository')
		private readonly facilityRepository: FacilityRepository,

		private readonly photoService: PhotoService,
		private readonly reviewService: ReviewService,
	) {
		super(facilityRepository);
	}

	async createFacilityWithFile(
		createFacilityDto: CreateFacilityDto,
		req: any,
		files?: { images?: Express.Multer.File[] },
	): Promise<Facility> {
		const facilityID = generateUniqueId();

		if (files != undefined) {
			const photos = await this.photoService.uploadManyFile(files, {
				ownerID: facilityID,
			});
			createFacilityDto.photos = photos.items;
		}
		createFacilityDto.ownerID = req.user.uid;
		return await super.create(createFacilityDto);
	}

	async updateReviewFacility(
		id: any,
		files: { images?: Express.Multer.File[] },
		req: any,
		reviewDto: CreateReviewDto,
	) {
		reviewDto.facilityID = id;
		await this.reviewService.createReviewWithFiles(files, req, reviewDto);
		return this.facilityRepository.findOneByID(id);
	}
}
