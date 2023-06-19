import { ListOptions, ListResponse } from '../response/common-response';

export interface Write<T> {
	create(item: T | any): Promise<T>;
	update(id: string, item: Partial<T>): Promise<T>;
	delete(id: string): Promise<boolean>;
}

export interface Read<T> {
	findMany(filter?: ListOptions<T>): Promise<ListResponse<T>>;
	findByID(id: string): Promise<T>;
	findOne(filter?: Partial<T>): Promise<T>;
}

export interface BaseServiceInterface<T> extends Write<T>, Read<T> {}
