import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { User, UserRole } from '../modules/users/schemas/user.schema';
import { Password } from '../utils/password';

@Injectable()
export class UserSeeder implements Seeder {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async seed(): Promise<any> {
    const items: any[] = [];

    for (let i = 0; i < 50; i++) {
      const role = i === 0 ? UserRole.ADMIN : UserRole.MEMBER;

      items.push({
        displayName: 'User ' + i + 1,
        email: `test${i + 1}@test.com`,
        password: await Password.hashPassword('123123123'),
        role: role,
      });
    }

    await this.userModel.insertMany(items);
  }
  async drop(): Promise<any> {
    await this.userModel.deleteMany({});
  }
}
