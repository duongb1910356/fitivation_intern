import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup-dto';

@Injectable()
export class AuthService {
	constructor(private readonly userService: UsersService) {}

	async signup(signupDto: SignupDto) {
		//
	}

	async login() {
		//
	}

	async logout() {
		//
	}

	async refreshTokens() {
		//
	}
}
