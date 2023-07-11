import { PackageStub } from '../test/stubs/package.stub';

export const PackageService = jest.fn().mockReturnValue({
	findOneByID: jest.fn().mockResolvedValue(PackageStub()),
	findMany: jest.fn().mockResolvedValue([PackageStub()]),
	findManyByPackageType: jest.fn().mockResolvedValue([PackageStub()]),
	countNumberOfPackageByPackageType: jest.fn().mockResolvedValue(2),
	create: jest.fn().mockResolvedValue(PackageStub()),
	update: jest.fn().mockResolvedValue(PackageStub()),
	delete: jest.fn().mockResolvedValue(true),
	isOwner: jest.fn().mockResolvedValue(true),
});
