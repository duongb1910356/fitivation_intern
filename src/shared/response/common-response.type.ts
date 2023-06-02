export type ListOptions<T = any> = Partial<T> & {
	limit?: number;
	offset?: number;
	search?: string;
	sortBy?: keyof T;
	sortOrder?: 'asc' | 'desc';
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
