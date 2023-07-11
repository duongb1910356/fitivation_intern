import { PackageTypeStub } from '../test/stubs/package-type.stub';

export const PackageTypeService = jest.fn().mockReturnValue({
	findOneByID: jest.fn().mockResolvedValue(PackageTypeStub()),
	findMany: jest.fn().mockResolvedValue([PackageTypeStub()]),
	findManyByFacility: jest.fn().mockResolvedValue([PackageTypeStub()]),
	create: jest.fn().mockResolvedValue(PackageTypeStub()),
	update: jest.fn().mockResolvedValue(PackageTypeStub()),
	delete: jest.fn().mockResolvedValue(true),
	decreaseAfterDeletion: jest.fn().mockResolvedValue(undefined),
	swapOrder: jest.fn().mockResolvedValue(true),
});
