import { ScheduleType } from 'src/modules/facility-schedule/entities/facility-schedule.entity';
import { State, Status } from 'src/modules/facility/schemas/facility.schema';
import { TimeType } from 'src/modules/package/entities/package.entity';

export type Photo = {
	_id: string;
	ownerID: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
};

export type FacilityID = {
	_id: string;
	brandID: string;
	facilityCategoryID: string[];
	ownerID: string;
	name: string;
	location: {
		coordinates: number[];
		type: 'Point';
	};
	address: {
		street: string;
		commune: string;
		communeCode: string;
		district: string;
		districtCode: string;
		province: string;
		provinceCode: string;
	};
	summary: string;
	description: string;
	fullAddress: string;
	phone: string;
	photos: Photo[];
	scheduleType: ScheduleType;
	state: State;
	status: Status;
	createdAt: Date;
	updatedAt: Date;
};

export type PackageTypeID = {
	_id: string;
	facilityID: FacilityID;
	name: string;
	description: string;
	price: number;
	order: number;
	createdAt: Date;
	updatedAt: Date;
};

export type PackageID = {
	_id: string;
	packageTypeID: PackageTypeID;
	type: TimeType;
	price: number;
	benefits: string[];
	createdAt: Date;
	updatedAt: Date;
};

export type CartItemIDs = {
	_id: string;
	packageID: PackageID;
	promotionIDs: [];
	promotionPrice: number;
	totalPrice: number;
	createdAt: Date;
	updatedAt: Date;
};

export type GetCartSuccessResponse = {
	_id: string;
	accountID: string;
	cartItemIDs: CartItemIDs[];
	promotionIDs: [];
	promotionPrice: number;
	totalPrice: number;
	createdAt: Date;
	updatedAt: Date;
};
