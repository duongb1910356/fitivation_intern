import {
	BadRequestException,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import {
	Facility,
	FacilityDocument,
	State,
	Status,
} from './schemas/facility.schema';
import { PhotoService } from '../photo/photo.service';
import { CreateFacilityDto } from './dto/create-facility-dto';
import { ReviewService } from '../reviews/reviews.service';
import { CreateReviewDto } from '../reviews/dto/create-review-dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, isValidObjectId } from 'mongoose';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { appConfig } from 'src/app.config';
import { UpdateFacilityDto } from './dto/update-facility-dto';
import { FacilityScheduleService } from '../facility-schedule/facility-schedule.service';
import { FacilityScheduleDto } from '../facility-schedule/dto/facility-schedule-dto';
import { HolidayDto } from '../holiday/dto/holiday-dto';
import { ConditionHoliday, HolidayService } from '../holiday/holiday.service';
import { Holiday } from '../holiday/entities/holiday.entity';
import { PackageTypeService } from '../package-type/package-type.service';
import { PackageType } from '../package-type/entities/package-type.entity';
import { CreatePackageTypeDto } from '../package-type/dto/create-package-type-dto';
import { UpdateOrderDto } from '../package-type/dto/update-order-dto';
import { AttendanceService } from '../attendance/attendance.service';
import { Photo } from '../photo/schemas/photo.schema';
import { Review } from '../reviews/schemas/reviews.schema';
import { UserRole } from '../users/schemas/user.schema';
import { CreatePromotionDto } from '../promotions/dto/create-promotion-dto';
import {
	Promotion,
	PromotionType,
} from '../promotions/schemas/promotion.schema';
import { PromotionsService } from '../promotions/promotions.service';
import { UpdatePromotionDto } from '../promotions/dto/update-promotion-dto';
import { PackageService } from '../package/package.service';
import { BrandService } from '../brand/brand.service';

@Injectable()
export class FacilityService {
	constructor(
		@InjectModel(Facility.name) private facilityModel: Model<FacilityDocument>,
		private readonly packageTypeService: PackageTypeService,
		private readonly packageService: PackageService,
		private readonly facilityScheduleService: FacilityScheduleService,
		private readonly holidayService: HolidayService,
		private readonly attendanceService: AttendanceService,
		private readonly photoService: PhotoService,
		private readonly reviewService: ReviewService,
		private readonly promotionService: PromotionsService,
		private readonly scheduleService: FacilityScheduleService,
		private readonly brandService: BrandService,
	) {}

	async isOwner(id: string, uid: string): Promise<boolean> {
		const facility = await this.findOneByID(id);
		const owner = facility.ownerID.toString();
		return uid === owner;
	}

	async getAllPackageType(id: string, filter: ListOptions<PackageType>) {
		return await this.packageTypeService.findManyByFacility(id, filter);
	}

	async createPackageType(id: string, data: CreatePackageTypeDto) {
		return await this.packageTypeService.create(id, data);
	}

	async swapPackageTypeInList(id: string, data: UpdateOrderDto) {
		return this.packageTypeService.swapOrder(id, data);
	}

	async findAllSchedules(id: string) {
		return await this.facilityScheduleService.findMany({
			facilityID: id,
		});
	}

	// async getCurrentSchedule(id: string) {
	// 	const facility = await this.findOneByID(id);
	// 	const condition = {
	// 		facilityID: id,
	// 		type: facility.scheduleType,
	// 	};
	// 	return await this.facilityScheduleService.findOneByCondition(condition);
	// }

	async createSchedule(id: string, data: FacilityScheduleDto) {
		const schedule = await this.facilityScheduleService.create(id, data);
		const facility = await this.facilityModel.findOneAndUpdate(
			{ _id: id },
			{ schedule: schedule },
			{ new: true },
		);
		return facility;
	}

	async createHoliday(id: string, data: HolidayDto) {
		return await this.holidayService.create(id, data);
	}

	async findAllHoliday(id: string, options: ListOptions<Holiday>) {
		let condition: ConditionHoliday = { facilityID: id };
		if (options.startDate) {
			condition = {
				...condition,
				startDate: { $gte: options.startDate },
			};
		}
		if (options.endDate) {
			condition = {
				...condition,
				endDate: { $lte: options.endDate },
			};
		}
		return await this.holidayService.findMany(condition, options);
	}

	async createAttendance(facilityID: string, accountID: string) {
		return await this.attendanceService.create(facilityID, accountID);
	}

	async getAttendance(facilityID: string, accountID: string) {
		return await this.attendanceService.findOneByCondition({
			facilityID,
			accountID,
		});
	}

	async create(
		createFacilityDto: CreateFacilityDto,
		req: any,
		files?: { images?: Express.Multer.File[] },
	): Promise<Facility> {
		createFacilityDto.ownerID = createFacilityDto.ownerID ?? req.user.sub;
		createFacilityDto.state = createFacilityDto.state ?? State.ACTIVE;

		if (createFacilityDto.brandID) {
			const brand = await this.brandService.findMany({
				_id: createFacilityDto.brandID,
				accountID: req.user.sub,
			});
			if (brand.total == 0) {
				throw new ForbiddenException(
					'You have not permission to register creating Facility with this Brand',
				);
			}
		}

		const facility = await this.facilityModel.create(createFacilityDto);

		if (createFacilityDto?.scheduleDto) {
			const scheduleDto = await this.scheduleService.create(
				facility._id,
				createFacilityDto.scheduleDto,
			);
			facility.schedule = scheduleDto._id;
		}

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
		const checkOk = await this.isOwnerFacility(id, req);
		if (!checkOk) {
			throw new ForbiddenException(
				'You do not have permission to access this document',
			);
		}
		return await this.facilityModel.findOneAndUpdate(
			{ _id: id },
			updateFacilityDto,
			{ new: true },
		);
	}

	async findMany(
		filter: ListOptions<Facility>,
	): Promise<ListResponse<Facility>> {
		try {
			const sortQuery = {};
			sortQuery[filter.sortField] = filter.sortOrder === 'asc' ? 1 : -1;
			const limit = filter.limit || 10;
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
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving facilities',
			);
		}
	}

	async getFacilities(
		filter: ListOptions<Facility>,
	): Promise<ListResponse<Facility>> {
		try {
			const sortQuery = {};
			sortQuery[filter.sortField] = filter.sortOrder === 'asc' ? 1 : -1;
			const limit = filter.limit || 10;
			const offset = filter.offset || 0;
			const result = await this.facilityModel
				.find({ ...filter, status: 'APPROVED' })
				.sort(sortQuery)
				.skip(offset)
				.limit(limit)
				.populate('brandID facilityCategoryID schedule');

			return {
				items: result,
				total: result?.length || 0,
				options: filter,
			};
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving facilities',
			);
		}
	}

	async findOneByID(id: string): Promise<Facility> {
		const facility = this.facilityModel.findById(id);
		return facility;
	}

	async getOneByID(facilityID: string): Promise<Facility> {
		try {
			const objectID = new mongoose.Types.ObjectId(facilityID);
			const facility = await this.facilityModel.aggregate([
				{ $match: { _id: objectID } },
				{
					$lookup: {
						from: 'facilitycategories',
						localField: 'facilityCategoryID',
						foreignField: '_id',
						as: 'facilityCategoryID',
					},
				},
				{
					$lookup: {
						from: 'facilityschedules',
						localField: 'schedule',
						foreignField: '_id',
						as: 'schedule',
					},
				},
				{ $unwind: '$schedule' },
				{
					$lookup: {
						from: 'brands',
						localField: 'brandID',
						foreignField: '_id',
						as: 'brandID',
					},
				},
				{ $unwind: '$brandID' },
				{
					$lookup: {
						from: 'packagetypes',
						let: { facID: '$_id' },
						pipeline: [
							{
								$match: {
									$expr: {
										$eq: ['$facilityID', '$$facID'],
									},
								},
							},
							{
								$lookup: {
									from: 'packages',
									localField: '_id',
									foreignField: 'packageTypeID',
									as: 'packages',
								},
							},
							// {
							// 	$project: {
							// 		_id: 1,
							// 		name: 1,
							// 		description: 1,
							// 		price: 1,
							// 		order: 1,
							// 		packages: { $arrayElemAt: ['$packages', 0] }, // Lấy một document từ collection packages
							// 	},
							// },
						],
						as: 'packageTypes',
					},
				},
			]);

			return facility[0] || null;
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving facility',
			);
		}
	}

	async addReview(
		id: any,
		req: any,
		reviewDto: CreateReviewDto,
		files?: { images?: Express.Multer.File[] },
	): Promise<Facility> {
		reviewDto.facilityID = id;
		const createdReview = await this.reviewService.create(
			req,
			reviewDto,
			files || null,
		);

		const averageStar = await this.reviewService.caculateAverageRating(id);
		return this.facilityModel.findOneAndUpdate(
			{ _id: id },
			{
				$push: {
					reviews: {
						$each: [createdReview],
						$slice: -appConfig.maxElementEmbedd,
					},
				},
				$set: {
					averageStar: averageStar,
				},
			},
			{ new: true },
		);
	}

	async addPhoto(
		id: any,
		req: any,
		files: { images: Express.Multer.File[] },
	): Promise<Facility> {
		const checkOk = await this.isOwnerFacility(id, req);
		if (!checkOk) {
			throw new BadRequestException(
				'You do not have permission to access this document',
			);
		}
		await this.photoService.uploadManyFile(files, id);
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
		const checkOk = await this.isOwnerFacility(id, req);
		if (!checkOk) {
			throw new BadRequestException(
				'You do not have permission to access this document',
			);
		}
		const facility = await this.facilityModel.findOneAndDelete({ _id: id });
		if (facility) {
			facility.reviews.forEach(async (el) => {
				await this.reviewService.delete(el._id);
			});
			facility.photos.forEach(async (el) => {
				await this.photoService.delete(el._id);
			});
			return true;
		}
		return false;
	}

	async deletePhoto(id: string, req: any, listID: string[]): Promise<Facility> {
		const result = await this.facilityModel.findOneAndUpdate(
			{ _id: id, ownerID: req.user.sub },
			{ $pull: { photos: { _id: { $in: listID } } } },
			{ new: true },
		);

		if (!result) {
			throw new ForbiddenException(
				'Facility is not exist or you is not owner of Facility',
			);
		}

		listID.forEach(async (element) => {
			if (isValidObjectId(element)) {
				await this.photoService.delete(element);
			}
		});

		return result || null;
	}

	async deleteReview(
		facilityID: string,
		req: any,
		listID: string[],
	): Promise<Facility> {
		if (req.user.role == 'FACILITY_OWNER' || req.user.role == 'ADMIN') {
			listID.forEach(async (element) => {
				if (isValidObjectId(element)) {
					await this.reviewService.delete(element);
				}
			});

			const averageStar = await this.reviewService.caculateAverageRating(
				facilityID,
			);
			const result = await this.facilityModel.findOneAndUpdate(
				{ _id: facilityID },
				{
					$pull: {
						reviews: {
							$and: [{ _id: { $in: listID } }],
						},
					},
					$set: {
						averageStar: averageStar,
					},
				},
				{ new: true },
			);

			if (!result) {
				throw new BadRequestException('Fail deleted review');
			}
			return result;
		}
		throw new ForbiddenException(
			'You must be Admin or Facility Owner to use this API',
		);
	}

	async deleteReviewByID(req: any, reviewID: string): Promise<Facility> {
		const review = await this.reviewService.findOneByID(reviewID);
		if (
			review.accountID == req.user.sub ||
			req.user.role == 'ADMIN' ||
			req.user.role == 'FACILITY_OWNER'
		) {
			const review = await this.reviewService.delete(reviewID);
			const averageStar = await this.reviewService.caculateAverageRating(
				review.facilityID,
			);
			const facility = await this.facilityModel.findOneAndUpdate(
				{ _id: review.facilityID },
				{
					$pull: {
						reviews: {
							$and: [{ _id: reviewID }],
						},
					},
					$set: {
						averageStar: averageStar,
					},
				},
				{ new: true },
			);
			return facility;
		}
		throw new ForbiddenException(
			'You do not have permission to deleted review',
		);
	}

	async findManyPhotos(
		facilityID: string,
		filter: ListOptions<Photo>,
	): Promise<ListResponse<Photo>> {
		filter.ownerID = facilityID;
		return this.photoService.findMany(filter);
	}

	async findManyReviews(
		facilityID: string,
		filter: ListOptions<Review>,
	): Promise<ListResponse<Review>> {
		const facility = await this.facilityModel.findById(facilityID);
		filter.facilityID = facility._id;
		return this.reviewService.getReview(filter);
	}

	async isOwnerFacility(facilityID: string, req: any): Promise<boolean> {
		const facility = await this.facilityModel.findById(facilityID);
		if (!facility) {
			throw new BadRequestException('Facility not exist');
		}
		return facility.ownerID == req.user.sub;
	}

	async updateStatus(
		facilityID: string,
		req: any,
		status: Status,
	): Promise<Facility> {
		if (req.user.role == UserRole.ADMIN) {
			return this.facilityModel.findOneAndUpdate(
				{ _id: facilityID },
				{ status: status },
				{ new: true },
			);
		} else {
			throw new ForbiddenException(
				'You must be admin to update the facility status',
			);
		}
	}

	async createPromotion(
		id: string,
		body: CreatePromotionDto,
	): Promise<Promotion> {
		const data = { targetID: id, type: PromotionType.FACILITY, ...body };
		return await this.promotionService.create(data);
	}

	// Tìm promotion khả dụng cho Facility
	async findManyPromotion(
		facilityID: string,
	): Promise<ListResponse<Promotion>> {
		return await this.promotionService.findMany({ targetID: facilityID });
	}

	async updatePromotion(
		promotionID: string,
		body: UpdatePromotionDto,
		req: any,
	) {
		const promotion = await this.promotionService.findOneByID(promotionID);

		const checkOk = await this.isOwnerFacility(promotion.targetID, req);
		console.log(checkOk);
		if (!checkOk) {
			throw new ForbiddenException(
				'You do not have permission to access this document',
			);
		}
		return await this.promotionService.update(promotionID, body);
	}

	async deletePromotion(promotionID: string, req: any) {
		const promotion = await this.promotionService.findOneByID(promotionID);
		const checkOk = await this.isOwnerFacility(promotion.targetID, req);
		if (!checkOk) {
			throw new ForbiddenException(
				'You do not have permission to access this document',
			);
		}
		return await this.promotionService.delete(promotionID);
	}

	async search(filter: ListOptions<any>): Promise<ListResponse<any>> {
		const search = filter?.search;
		const sortOrder = filter?.sortOrder || 'asc';
		const latitude = parseFloat(filter?.latitude) || undefined;
		const longitude = parseFloat(filter?.longitude) || undefined;
		const limit = filter?.limit || 10;
		const offset = filter?.offset || 0;

		const aggregatePipeline: any[] = [];

		if (longitude != undefined && latitude != undefined) {
			if (
				longitude < -180 ||
				longitude > 180 ||
				latitude < -90 ||
				latitude > 90
			) {
				throw new BadRequestException('Coordinates invalid');
			}

			aggregatePipeline.push(
				{
					$geoNear: {
						near: {
							type: 'Point',
							coordinates: [longitude, latitude],
						},
						distanceField: 'distance',
						spherical: true,
					},
				},
				{
					$addFields: {
						distance: '$distance',
					},
				},
			);
		}

		aggregatePipeline.push(
			{
				$lookup: {
					from: 'facilitycategories',
					localField: 'facilityCategoryID',
					foreignField: '_id',
					as: 'facilityCategoryID',
				},
			},
			{
				$lookup: {
					from: 'facilityschedules',
					localField: 'schedule',
					foreignField: '_id',
					as: 'schedule',
				},
			},
			{ $unwind: '$schedule' },
			{
				$lookup: {
					from: 'brands',
					localField: 'brandID',
					foreignField: '_id',
					as: 'brandID',
				},
			},
			{ $unwind: '$brandID' },
		);

		if (search != undefined) {
			const regex = new RegExp(search.split('').join('.*'), 'i');
			aggregatePipeline.push({
				$match: {
					$or: [
						{ fullAddress: regex },
						{ name: regex },
						{ 'brandID.name': { $regex: regex } },
					],
				},
			});
		}

		const facilities = await this.facilityModel.aggregate(aggregatePipeline);
		let result = await Promise.all(
			facilities.map(async (el) => {
				const foundPackage =
					await this.packageService.findPackageWithLowestPrice(el._id);
				return { ...el, package: foundPackage || {} };
			}),
		);

		if (filter.sortField == 'distance') {
			result.sort((a, b) => a?.distance - b?.distance || 0);
		} else if (filter.sortField == 'price') {
			result.sort((a, b) => {
				const priceA = a.package?.price;
				const priceB = b.package?.price;

				if (sortOrder === 'asc') {
					return priceA - priceB;
				} else if (sortOrder === 'desc') {
					return priceB - priceA;
				} else {
					return 0;
				}
			});
		}
		result = result.slice(offset, offset + limit);

		return {
			items: result,
			total: result.length,
			options: filter,
		};
	}

	async getNearestFacilities(
		longitude: number,
		latitude: number,
	): Promise<ListResponse<any>> {
		longitude = parseFloat(longitude.toString()) || undefined;
		latitude = parseFloat(latitude.toString()) || undefined;

		if (longitude == undefined || latitude == undefined) {
			throw new BadRequestException('Coordinates invalid');
		}
		const facilities = await this.facilityModel.aggregate([
			{
				$geoNear: {
					near: {
						type: 'Point',
						coordinates: [longitude, latitude],
					},
					distanceField: 'distance',
					spherical: true,
					maxDistance: 5000,
				},
			},
			{
				$addFields: {
					distance: '$distance',
				},
			},
			{
				$sort: {
					distance: 1,
				},
			},
			{
				$lookup: {
					from: 'facilitycategories',
					localField: 'facilityCategoryID',
					foreignField: '_id',
					as: 'category',
				},
			},
		]);

		const result = await Promise.all(
			facilities.map(async (el) => {
				const foundPackage =
					await this.packageService.findPackageWithLowestPrice(el._id);
				return { ...el, package: foundPackage || {} };
			}),
		);

		return {
			items: result,
			total: result.length,
			options: {
				longitude: longitude,
				latitude: latitude,
			},
		};
	}
}
