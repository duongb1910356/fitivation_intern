import { Injectable } from '@nestjs/common';

@Injectable()
export class BrandService {
	create() {
		//
	}

	findAll() {
		//
	}

	findOne(id: number) {
		return `This action returns a #${id} brand`;
	}

	update(id: number) {
		return `This action updates a #${id} brand`;
	}

	remove(id: number) {
		return `This action removes a #${id} brand`;
	}
}
