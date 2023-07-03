import { Test, TestingModule } from '@nestjs/testing';
import { PackageTypeController } from '../package-type.controller';
import { PackageTypeStub } from './stubs/package-type.stub';
import { PackageTypeService } from '../package-type.service';

jest.mock('../package-type.service');
describe('PackageTypeController', () => {
	let controller: PackageTypeController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PackageTypeController],
			providers: [PackageTypeService],
		}).compile();

		controller = module.get<PackageTypeController>(PackageTypeController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('getPackageType', () => {
		it('should get one PackageType by PackageTypeID', async () => {
			const response = await controller.getPackageType(PackageTypeStub()._id);

			expect(response).toEqual(PackageTypeStub());
		});
	});
});
