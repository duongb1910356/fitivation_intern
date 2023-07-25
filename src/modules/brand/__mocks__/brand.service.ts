import { BrandStub } from '../test/stubs/brand.stub';

export const BrandService = jest.fn().mockReturnValue({
	findMany: jest.fn().mockResolvedValue([BrandStub()]),
});
