import { PhotoStub } from '../test/stubs/photo.stub';

export const PhotoService = jest.fn().mockReturnValue({
	delete: jest.fn().mockResolvedValue(PhotoStub()),
	uploadOneFile: jest.fn().mockResolvedValue(PhotoStub()),
});
