import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserRole, UserStatus } from 'src/modules/users/schemas/user.schema';
import { userStub } from 'src/modules/users/test/stubs/user.stub';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

jest.mock('../../users/users.service');

describe('AuthService', () => {
	let authService: AuthService;
	let userService: UsersService;
	const tokenResponse = {
		accessToken: 'access_token',
		refreshToken: 'refresh_token',
	};
	const jwtService = {
		signAsync: jest.fn().mockResolvedValue('token'),
	};

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				UsersService,
				JwtService,
				{
					provide: JwtService,
					useValue: jwtService,
				},
			],
		}).compile();

		authService = moduleRef.get<AuthService>(AuthService);
		userService = moduleRef.get<UsersService>(UsersService);

		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(authService).toBeDefined();
		expect(jwtService).toBeDefined();
	});

	describe('signTokens', () => {
		const userID = '64bd0a6fc8d5928f7897e90b';
		const role = UserRole.MEMBER;

		it('should return token', async () => {
			jest
				.spyOn(jwtService, 'signAsync')
				.mockResolvedValueOnce(tokenResponse.accessToken);
			jest
				.spyOn(jwtService, 'signAsync')
				.mockResolvedValueOnce(tokenResponse.refreshToken);

			const result = await authService.signTokens(userID, role);

			expect(jwtService.signAsync).toHaveBeenCalledWith(
				{ role, sub: userID },
				{ expiresIn: 'undefined', secret: 'undefined' },
			);
			expect(result).toEqual(tokenResponse);
		});
	});

	describe('signup', () => {
		const signupDto = {
			username: 'member',
			email: 'member@test.com',
			password: '123123123',
		};

		it('should return token response', async () => {
			jest.spyOn(userService, 'createOne').mockResolvedValue(userStub());

			jest.spyOn(authService, 'signTokens').mockResolvedValue(tokenResponse);

			jest
				.spyOn(authService, 'updateRefreshTokenHashed')
				.mockResolvedValue(null);

			const result = await authService.signup(signupDto);

			expect(authService.signTokens).toHaveBeenCalledWith(
				userStub()._id,
				userStub().role,
			);

			expect(authService.updateRefreshTokenHashed).toHaveBeenCalledWith(
				userStub()._id,
				tokenResponse.refreshToken,
			);

			expect(result).toEqual(tokenResponse);
		});
	});

	describe('login', () => {
		const loginDto = {
			email: 'member@test.com',
			password: '123123123',
		};

		it('should return tokens', async () => {
			jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(userStub());

			jest.spyOn(authService, 'signTokens').mockResolvedValue(tokenResponse);

			jest
				.spyOn(authService, 'updateRefreshTokenHashed')
				.mockResolvedValue(null);

			const result = await authService.login(loginDto);

			expect(authService.signTokens).toHaveBeenCalledWith(
				userStub()._id,
				userStub().role,
			);

			expect(authService.updateRefreshTokenHashed).toHaveBeenCalledWith(
				userStub()._id,
				tokenResponse.refreshToken,
			);

			expect(result).toEqual(tokenResponse);
		});

		it('should throw error if password not correct', () => {
			jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(userStub());

			jest.spyOn(authService, 'signTokens').mockResolvedValue(tokenResponse);

			jest
				.spyOn(authService, 'updateRefreshTokenHashed')
				.mockResolvedValue(null);

			expect(
				authService.login({
					email: 'member@test.com',
					password: '12344321123',
				}),
			).rejects.toEqual(new BadRequestException('Password not correct'));
		});

		it('should throw error if user inactive', () => {
			const user = userStub();

			user.status = UserStatus.INACTIVE;

			jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(user);

			expect(authService.login(loginDto)).rejects.toEqual(
				new BadRequestException('User status inactive'),
			);
		});
	});

	describe('logout', () => {
		const userID = '64bd0a6fc8d5928f7897e90b';

		it('should return true', async () => {
			const user = userStub();
			jest.spyOn(userService, 'findOneByID').mockResolvedValue(user);

			jest.spyOn(userService, 'findOneByIDAndUpdate').mockResolvedValue(user);

			const result = await authService.logout(userID);

			expect(userService.findOneByID).toHaveBeenCalledWith(userID);

			expect(userService.findOneByIDAndUpdate).toHaveBeenCalledWith(userID, {
				refreshToken: null,
			});

			expect(result).toEqual(true);
		});

		it('should throw error if user already logout', () => {
			const user = userStub();
			user.refreshToken = null;

			jest.spyOn(userService, 'findOneByID').mockResolvedValue(user);

			jest.spyOn(userService, 'findOneByIDAndUpdate').mockResolvedValue(user);

			expect(authService.logout(userID)).rejects.toEqual(
				new BadRequestException('User already logout'),
			);
			expect(userService.findOneByID).toHaveBeenCalledWith(userID);
		});
	});
	describe('refreshTokens', () => {
		const userID = '64bd0a6fc8d5928f7897e90b';

		it('should return tokens', async () => {
			const refreshToken =
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGFmYmQ0ODIxMjM2M2VjMzI3OTNkMDgiLCJyb2xlIjoiTUVNQkVSIiwiaWF0IjoxNjkwNDMwNDUyLCJleHAiOjE2OTEwMzUyNTJ9.k19vP6AGg58c--Q_aS0q2AHeemzKp6KstQ8WmaQ1tKg';

			jest.spyOn(userService, 'findOneByID').mockResolvedValue(userStub());

			jest.spyOn(authService, 'signTokens').mockResolvedValue(tokenResponse);

			jest
				.spyOn(authService, 'updateRefreshTokenHashed')
				.mockResolvedValue(null);

			const result = await authService.refreshTokens(userID, refreshToken);

			expect(userService.findOneByID).toHaveBeenCalledWith(userID);

			expect(authService.signTokens).toHaveBeenCalledWith(
				userStub()._id,
				userStub().role,
			);

			expect(authService.updateRefreshTokenHashed).toHaveBeenCalledWith(
				userStub()._id,
				tokenResponse.refreshToken,
			);

			expect(result).toEqual(tokenResponse);
		});

		it('should throw Unauthorized if user not have refreshToken in database', () => {
			const user = userStub();
			const refreshToken =
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGFmYmQ0ODIxMjM2M2VjMzI3OTNkMDgiLCJyb2xlIjoiTUVNQkVSIiwiaWF0IjoxNjkwNDMwNDUyLCJleHAiOjE2OTEwMzUyNTJ9.k19vP6AGg58c--Q_aS0q2AHeemzKp6KstQ8WmaQ1tKg';

			user.refreshToken = null;

			jest.spyOn(userService, 'findOneByID').mockResolvedValue(user);

			expect(authService.refreshTokens(userID, refreshToken)).rejects.toEqual(
				new UnauthorizedException('Unauthorized'),
			);

			expect(userService.findOneByID).toHaveBeenCalledWith(userID);
		});

		it('should throw Unauthorized if refresh token does not match', () => {
			const refreshToken = 'other refresh token';

			jest.spyOn(userService, 'findOneByID').mockResolvedValue(userStub());

			expect(authService.refreshTokens(userID, refreshToken)).rejects.toEqual(
				new UnauthorizedException('Unauthorized'),
			);
		});
	});

	describe('signupAsFacilityOwner', () => {
		const signupDto = userStub();

		it('should return tokens', async () => {
			signupDto.role = UserRole.FACILITY_OWNER;

			jest
				.spyOn(userService, 'createOneAsFacilityOwner')
				.mockResolvedValue(signupDto);

			jest.spyOn(authService, 'signTokens').mockResolvedValue(tokenResponse);

			jest
				.spyOn(authService, 'updateRefreshTokenHashed')
				.mockResolvedValue(null);

			const result = await authService.signupAsFacilityOwner(signupDto);

			expect(authService.signTokens).toHaveBeenCalledWith(
				signupDto._id,
				signupDto.role,
			);

			expect(authService.updateRefreshTokenHashed).toHaveBeenCalledWith(
				userStub()._id,
				tokenResponse.refreshToken,
			);

			expect(result).toEqual(tokenResponse);
		});
	});
});
