import { User } from 'src/modules/users/schemas/user.schema';
import { Request } from '@nestjs/common';

interface RequestWithUser extends Request {
	user: User;
}

export default RequestWithUser;
