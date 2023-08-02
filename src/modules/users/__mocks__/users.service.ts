import { userStub } from 'src/modules/users/test/stubs/user.stub';

export const UsersService = jest.fn().mockReturnValue({
	findOneByIDAndUpdate: jest.fn().mockResolvedValue(userStub()),
	findOneByEmail: jest.fn().mockResolvedValue(userStub()),
	findOneByID: jest.fn().mockResolvedValue(userStub()),
	createOne: jest.fn().mockResolvedValue(userStub()),
	findOneAndUpdate: jest.fn().mockResolvedValue(userStub()),
	deleteOne: jest.fn().mockResolvedValue(true),
	getCurrentUser: jest.fn().mockResolvedValue(userStub()),
	updateMyData: jest.fn().mockResolvedValue(userStub()),
	updateMyPassword: jest.fn().mockResolvedValue(true),
	deleteMe: jest.fn().mockResolvedValue(true),
	checkExist: jest.fn().mockResolvedValue({ value: false, message: null }),
	createOneAsFacilityOwner: jest.fn(),
});
