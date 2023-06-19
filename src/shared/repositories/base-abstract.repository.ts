import { Model } from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';
import { BaseRepositoryInterface } from './base-interface.repository';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';

export abstract class BaseRepositoryAbstract<T extends BaseObject>
	implements BaseRepositoryInterface<T>
{
	constructor(private model: Model<T>) {
		this.model = model;
	}

	async create(dto: T | any): Promise<T> {
		const created_data = await this.model.create(dto);
		return created_data.save();
	}

	async findOneByID(id: string): Promise<T> {
		try {
			const item = await this.model.findById(id);
			return item;
		} catch (error) {
			throw new Error(error);
		}
	}

	async findMany(filter: ListOptions<T>): Promise<ListResponse<T>> {
		const limit = filter.limit || 0;
		const offset = filter.offset || 0;
		const items = await this.model.find(filter).skip(offset).limit(limit);
		return {
			items: items,
			total: items?.length,
			options: filter,
		};
	}

	async delete(id: string): Promise<boolean> {
		const delete_item = await this.model.findById(id);
		if (!delete_item) {
			return false;
		}
		return await this.model.findOneAndDelete({ _id: id });
	}

	async update(id: string, dto: Partial<T>): Promise<T> {
		const brand = await this.model
			.findByIdAndUpdate(id, dto, { new: true })
			.exec();
		return brand;
	}
}
