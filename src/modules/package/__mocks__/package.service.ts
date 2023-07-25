import { PackageStub } from '../test/stubs/package.stub';

export const PackageService = jest.fn().mockReturnValue({
	findOneByID: jest.fn().mockResolvedValue(PackageStub()),
	findMany: jest.fn().mockResolvedValue([PackageStub()]),
	findManyByPackageType: jest.fn().mockResolvedValue([PackageStub()]),
	countNumberOfPackageByPackageType: jest.fn().mockResolvedValue(0),
	create: jest.fn().mockResolvedValue(PackageStub()),
	update: jest.fn().mockResolvedValue(PackageStub()),
	delete: jest.fn().mockResolvedValue(''),
	decreaseAfterDeletion: jest.fn().mockResolvedValue(undefined),
	isOwner: jest.fn().mockResolvedValue(true),
});
