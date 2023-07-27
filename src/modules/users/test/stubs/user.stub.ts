import { Gender, User, UserRole, UserStatus } from '../../schemas/user.schema';

export const userStub = (): User => {
	return {
		_id: '649a8f8ab185ffb672485391',
		createdAt: new Date('2023-07-01T11:43:14.752Z'),
		updatedAt: new Date('2023-07-01T11:44:09.175Z'),
		role: UserRole.MEMBER,
		username: 'member',
		email: 'member@test.com',
		password:
			'712cf3bceba7e501647e6d1d056658ecb4019d6bd39e3a183dd7df7bd38308f29afde375a51c5d095fc9fb716939bd09324e9c21650152dc67fc7ba55efa5e6b.a7b6621486f7bfb813750da75f150978',
		refreshToken:
			'15aed3c1397db000512e4b3c8f2283e0beb12635e88cdd39fa34dcc7db576d3984e80c678ec433f69a832b04f0fb86c64ef0adf2cef7fab6b6167bfe99f35a24.7fa13f2369152348ac8012ae17656785',
		displayName: 'Member user',
		firstName: 'string',
		lastName: 'string',
		gender: Gender.MALE,
		birthDate: new Date('2023-07-01T11:26:17.640Z'),
		tel: '0888888888',
		address: {
			createdAt: new Date('2023-07-01T11:43:14.751Z'),
			updatedAt: new Date('2023-07-01T11:43:14.751Z'),
			province: 'Can Tho',
			district: 'Ninh Kieu',
			commune: 'Xuan Khanh',
			_id: '64a01152d4951f86b3c95ef0',
		},
		isMember: false,
		status: UserStatus.ACTIVE,
	};
};
