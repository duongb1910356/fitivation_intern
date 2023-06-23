import { Injectable } from '@nestjs/common';
import { Facility, FacilityDocument } from './schemas/facility.schema';
import { PhotoService } from '../photo/photo.service';
import { CreateFacilityDto } from './dto/create-facility-dto';
import { generateUniqueId } from 'src/utils/gen-uid';
import { ReviewService } from '../reviews/reviews.service';
import { CreateReviewDto } from '../reviews/dto/create-review-dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { appConfig } from 'src/app.config';
import { DeletePhotoOfFacilityDto } from './dto/update-photo-facility';

@Injectable()
export class FacilityService {
	constructor(
		// @Inject('FacilityRepository')
		// private readonly facilityRepository: FacilityRepository,
		@InjectModel(Facility.name) private facilityModel: Model<FacilityDocument>,

		private readonly photoService: PhotoService,
		private readonly reviewService: ReviewService,
	) {}

	async create(
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
		return await this.facilityModel.create(createFacilityDto);
	}

	async addReview(
		id: any,
		req: any,
		reviewDto: CreateReviewDto,
		files?: { images?: Express.Multer.File[] },
	) {
		reviewDto.facilityID = id;
		await this.reviewService.create(req, reviewDto, files || null);
		return this.facilityModel.findById(id);
	}

	async addPhoto(
		id: any,
		req: any,
		files?: { images?: Express.Multer.File[] },
	) {
		await this.photoService.uploadManyFile(files || null, {
			ownerID: id,
		});
		const sortPhoto = await this.photoService.findMany({
			ownerID: id,
			sortField: 'createdAt',
			sortOrder: 'desc',
			limit: parseInt(appConfig.maxElementEmbedd),
		});
		const facilite = await this.facilityModel.findById(id);
		facilite.photos = sortPhoto.items;
		return facilite.save();
	}

	async findMany(
		filter: ListOptions<Facility>,
	): Promise<ListResponse<Facility>> {
		const sortQuery = {};
		sortQuery[filter.sortField] = filter.sortOrder === 'asc' ? 1 : -1;
		const limit = filter.limit || 0;
		const offset = filter.offset || 0;
		const result = await this.facilityModel
			.find(filter)
			.sort(sortQuery)
			.skip(offset)
			.limit(limit);
		return {
			items: result,
			total: result?.length,
			options: filter,
		};
	}

	async findOneByID(id: string): Promise<Facility> {
		return await this.facilityModel.findById(id);
	}

	async delete(id: string): Promise<boolean> {
		const review = await this.facilityModel.findOneAndDelete({ _id: id });
		review.photos.forEach((re) => {
			this.photoService.delete(re._id);
		});
		return null;
	}

	deletePhoto(
		id: any,
		req: any,
		listDelete: DeletePhotoOfFacilityDto,
	): Promise<boolean> {
		listDelete.deletedImages.forEach(async (element) => {
			await this.facilityModel.findOneAndUpdate(
				{ _id: id },
				{ $pull: { photos: { _id: element } } },
			);
			await this.photoService.delete(element);
		});
		return null;
	}
}
