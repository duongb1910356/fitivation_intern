import { CategoryStub } from '../test/stubs/facility-category.stub';

export const PackageTypeService = jest.fn().mockReturnValue({
	findOneByID: jest.fn().mockResolvedValue(CategoryStub()),
	findMany: jest.fn().mockResolvedValue([CategoryStub()]),
	create: jest.fn().mockResolvedValue(CategoryStub()),
	update: jest.fn().mockResolvedValue(CategoryStub()),
	delete: jest.fn().mockResolvedValue(''),
});
