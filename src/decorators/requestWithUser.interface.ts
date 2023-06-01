import { User } from 'src/modules/users/schemas/user.schema';
import { Request } from '@nestjs/common';

interface RequestWithUser extends Request {
	user: User;
}

export default RequestWithUser;
//https://wanago.io/2020/05/25/api-nestjs-authenticating-users-bcrypt-passport-jwt-cookies/
