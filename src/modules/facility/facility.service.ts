import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException,
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
import { Model, isValidObjectId } from 'mongoose';
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
import { Promotion } from '../promotions/schemas/promotion.schema';
import { PromotionsService } from '../promotions/promotions.service';
import { UpdatePromotionDto } from '../promotions/dto/update-promotion-dto';

@Injectable()
export class FacilityService {
	constructor(
		@InjectModel(Facility.name) private facilityModel: Model<FacilityDocument>,
		private readonly packageTypeService: PackageTypeService,
		private readonly facilityScheduleService: FacilityScheduleService,
		private readonly holidayService: HolidayService,
		private readonly attendanceService: AttendanceService,
		private readonly photoService: PhotoService,
		private readonly reviewService: ReviewService,
		private readonly promotionService: PromotionsService,
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

	async getCurrentSchedule(id: string) {
		const facility = await this.findOneByID(id);
		const condition = {
			facilityID: id,
			type: facility.scheduleType,
		};
		return await this.facilityScheduleService.findOneByCondition(condition);
	}

	async createSchedule(id: string, data: FacilityScheduleDto) {
		return await this.facilityScheduleService.create(id, data);
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
		createFacilityDto.ownerID = createFacilityDto.state ?? req.user.sub;
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
		const checkOk = await this.isOwnerFacility(id, req);
		if (!checkOk) {
			throw new BadRequestException(
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
		const facility = this.facilityModel
			.findById(id)
			.populate('brandID')
			.populate('facilityCategoryID');
		if (!facility) {
			throw new NotFoundException('Facility not found');
		}
		return facility;
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
		files: { images: Express.Multer.File[] },
	): Promise<Facility> {
		const checkOk = await this.isOwnerFacility(id, req);
		if (!checkOk) {
			throw new BadRequestException(
				'You do not have permission to access this document',
			);
		}
		await this.photoService.uploadManyFile(files || null, id);
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
			{ _id: id },
			{ $pull: { photos: { _id: { $in: listID } } } },
			{ new: true },
		);

		listID.forEach(async (element) => {
			if (isValidObjectId(element)) {
				await this.photoService.delete(element);
			}
		});

		return result;
	}

	async deleteReview(
		facilityID: string,
		req: any,
		listID: string[],
	): Promise<Facility> {
		const result = await this.facilityModel.findOneAndUpdate(
			{ _id: facilityID },
			{ $pull: { reviews: { _id: { $in: listID } } } },
			{ new: true },
		);

		listID.forEach(async (element) => {
			if (isValidObjectId(element)) {
				await this.reviewService.delete(element);
			}
		});
		return result;
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
		filter.facilityID = facility;
		return this.reviewService.findMany(filter);
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
		}
	}

	async createPromotion(
		id: string,
		body: CreatePromotionDto,
	): Promise<Promotion> {
		return await this.promotionService.create(body);
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
}
