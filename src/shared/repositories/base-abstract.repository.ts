import { Model, isValidObjectId } from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';
import { BaseRepositoryInterface } from './base-interface.repository';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { BadRequestException, NotFoundException } from '@nestjs/common';

export abstract class BaseRepositoryAbstract<T extends BaseObject>
	implements BaseRepositoryInterface<T>
{
	constructor(private model: Model<T>) {
		this.model = model;
	}

	async create(dto: T | any): Promise<T> {
		const created_data = await this.model.create(dto);
		return created_data;
	}

	async findOneByID(id: string): Promise<T> {
		if (!isValidObjectId(id)) {
			throw new BadRequestException('ID invalid');
		}
		const item = await this.model.findById(id);
		if (!item) {
			throw new NotFoundException('Data not found');
		}
		return item;
	}

	async findMany(filter: ListOptions<T>): Promise<ListResponse<T>> {
		const limit = filter.limit || 0;
		const offset = filter.offset || 0;
		const items = await this.model.find(filter).skip(offset).limit(limit);
		if (items?.length == 0) {
			throw new NotFoundException('Items not found');
		}
		return {
			items: items,
			total: items?.length,
			options: filter,
		};
	}

	async findOne(condition: Partial<T>): Promise<T> {
		return await this.model.findOne({ condition }).exec();
	}

	async delete(id: string): Promise<boolean> {
		if (!isValidObjectId(id)) {
			throw new BadRequestException('ID invalid');
		}
		const delete_item = await this.model.findOneAndDelete({ _id: id });
		if (!delete_item) {
			throw new NotFoundException('Not found item to delete');
		}
		return true;
	}

	async update(id: string, dto: Partial<T>): Promise<T> {
		if (!isValidObjectId(id)) {
			throw new BadRequestException('ID invalid');
		}
		const brand = await this.model.findByIdAndUpdate(id, dto, { new: true });
		if (!brand) {
			throw new NotFoundException('Not found item to update');
		}
		return brand;
	}
}
