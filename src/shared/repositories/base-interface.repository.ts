import { ListOptions, ListResponse } from 'src/shared/response/common-response';

export interface BaseRepositoryInterface<T> {
	create(dto: T | any): Promise<T>;

	findByID(id: string): Promise<T>;

	findMany(filter: ListOptions<T>): Promise<ListResponse<T>>;

	findOne(filter: Partial<T>): Promise<T>;

	delete(id: string): Promise<boolean>;

	update(id: string, dto: Partial<T>): Promise<T>;
}
