import { ForbiddenException, Injectable } from '@nestjs/common';
import { Facility, FacilityDocument, State } from './schemas/facility.schema';
import { PhotoService } from '../photo/photo.service';
import { CreateFacilityDto } from './dto/create-facility-dto';
import { ReviewService } from '../reviews/reviews.service';
import { CreateReviewDto } from '../reviews/dto/create-review-dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { appConfig } from 'src/app.config';
import { UpdateFacilityDto } from './dto/update-facility-dto';

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
		createFacilityDto.ownerID = createFacilityDto.ownerID ?? req.user.uid;
		createFacilityDto.state = createFacilityDto.state ?? State.ACTIVE;

		const facility = await this.facilityModel.create(createFacilityDto);
		if (files && files.images) {
			const photos = await this.photoService.uploadManyFile(files, {
				ownerID: facility._id,
			});
			facility.photos = photos.items;
		}
		return await facility.save();
	}

	async update(
		id: string,
		updateFacilityDto: UpdateFacilityDto,
		req: any,
	): Promise<Facility> {
		this.isOwnerFacility(id, req);
		return await this.facilityModel.findOneAndUpdate(
			{ _id: id },
			updateFacilityDto,
			{ new: true },
		);
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
		const result = this.facilityModel
			.findById(id)
			.populate('brandID')
			.populate('facilityCategoryID');
		return result;
	}

	async addReview(
		id: any,
		req: any,
		reviewDto: CreateReviewDto,
		files?: { images?: Express.Multer.File[] },
	): Promise<Facility> {
		this.isOwnerFacility(id, req);
		reviewDto.facilityID = id;
		const createdReview = await this.reviewService.create(
			req,
			reviewDto,
			files || null,
		);

		return this.facilityModel.findOneAndUpdate(
			{ _id: id },
			{
				$push: {
					reviews: {
						$each: [createdReview],
						$slice: -appConfig.maxElementEmbedd,
					},
				},
			},
			{ new: true },
		);
	}

	async addPhoto(
		id: any,
		req: any,
		files?: { images?: Express.Multer.File[] },
	): Promise<Facility> {
		this.isOwnerFacility(id, req);
		await this.photoService.uploadManyFile(files || null, {
			ownerID: id,
		});
		const sortPhoto = await this.photoService.findMany({
			ownerID: id,
			sortField: 'createdAt',
			sortOrder: 'desc',
			limit: parseInt(appConfig.maxElementEmbedd),
		});
		const facility = await this.facilityModel.findById(id);
		facility.photos = [...sortPhoto.items];
		return facility.save();
	}

	async delete(id: string, req: any): Promise<boolean> {
		this.isOwnerFacility(id, req);
		const facility = await this.facilityModel.findById(id);
		facility.reviews.forEach(async (el) => {
			await this.reviewService.delete(el._id);
		});
		facility.photos.forEach(async (el) => {
			await this.photoService.delete(el._id);
		});
		await this.facilityModel.findOneAndDelete({ _id: id });
		return true;
	}

	async deletePhoto(id: string, req: any, listID: string[]): Promise<Facility> {
		this.isOwnerFacility(id, req);
		listID.forEach(async (element) => {
			if (isValidObjectId(element)) {
				await this.facilityModel.findOneAndUpdate(
					{ _id: id },
					{ $pull: { photos: { _id: element } } },
					{ new: true },
				);
				await this.photoService.delete(element);
			}
		});
		return this.facilityModel.findById(id);
	}

	async deleteReview(
		facilityID: string,
		req: any,
		listID: string[],
	): Promise<Facility> {
		this.isOwnerFacility(facilityID, req);
		listID.forEach(async (element) => {
			if (isValidObjectId(element)) {
				await this.facilityModel.findOneAndUpdate(
					{ _id: facilityID },
					{ $pull: { reviews: { _id: element } } },
				);
				await this.reviewService.delete(element);
			}
		});
		return this.facilityModel.findById(facilityID);
	}

	async isOwnerFacility(facilityID: string, req: any): Promise<void> {
		const ownerID = await this.facilityModel.findById(facilityID);
		if (ownerID != req.user.uid) {
			throw new ForbiddenException(
				'You do not have permission to access this document',
			);
		}
	}
}
