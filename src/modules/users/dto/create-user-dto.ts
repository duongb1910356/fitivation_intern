import { UserRole } from '../schemas/user.schema';

export class CreateUserDto {
  displayName: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
}
