export const PhotoService = jest.fn().mockReturnValue({
	uploadOneFile: jest.fn().mockResolvedValue(''),
	uploadManyFile: jest.fn().mockResolvedValue(['']),
	findMany: jest.fn().mockResolvedValue(''),
	findOneByID: jest.fn().mockResolvedValue(''),
	delete: jest.fn().mockResolvedValue(true),
});
