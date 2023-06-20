import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BaseRepositoryAbstract } from '../repositories/base-abstract.repository';
import { ListOptions, ListResponse } from '../response/common-response';
import { BaseObject } from '../schemas/base-object.schema';
import { BaseServiceInterface } from './base-interface.service';
import { Types } from 'mongoose';

export abstract class BaseServiceAbstract<T extends BaseObject>
	implements BaseServiceInterface<T>
{
	constructor(private readonly repository: BaseRepositoryAbstract<T>) {}

	async create(create_dto: T | any): Promise<T> {
		try {
			return await this.repository.create(create_dto);
		} catch (error) {
			throw new BadRequestException(error);
		}
	}

	async findMany(filter?: ListOptions<T>): Promise<ListResponse<T>> {
		return await this.repository.findMany(filter);
	}

	async findOneByID(id: string) {
		if (!Types.ObjectId.isValid(id)) {
			throw new BadRequestException('ID invalid');
		}
		const data = await this.repository.findOneByID(id);
		if (!data) {
			throw new NotFoundException('Not found');
		}
		return data;
	}

	async findOne(filter: Partial<T>) {
		return await this.repository.findOne(filter);
	}

	async update(id: string, update_dto: Partial<T>) {
		if (!Types.ObjectId.isValid(id)) {
			throw new BadRequestException('ID invalid');
		}
		const data = await this.repository.update(id, update_dto);
		if (!data) {
			throw new NotFoundException('Not found');
		}
		return data;
	}

	async delete(id: string) {
		if (!Types.ObjectId.isValid(id)) {
			throw new BadRequestException('ID invalid');
		}
		await this.repository.delete(id);
		return true;
	}
}
