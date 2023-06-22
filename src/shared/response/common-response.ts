type Projection<T> = {
	[K in keyof T]?: 1 | 0;
};

export type ListOptions<T = any> = Partial<T> & {
	limit?: number;
	offset?: number;
	search?: string;
	sortField?: keyof T;
	sortOrder?: 'asc' | 'desc';
	projection?: Projection<T>;
};

export interface ListResponse<T> {
	items: T[];
	total: number;
	options: ListOptions<T>;
}

export interface ErrorResponse<T> {
	code: string;
	message: string;
	details: {
		[Key in keyof T]: string;
	};
}
