import { PhotoStub } from '../test/stub/photo.stub';

export const PhotoService = jest.fn().mockReturnValue({
	uploadOneFile: jest.fn().mockResolvedValue(PhotoStub()),
	uploadManyFile: jest.fn(),
	findMany: jest.fn(),
	findOneByID: jest.fn(),
	delete: jest.fn().mockResolvedValue(PhotoStub()),
});
