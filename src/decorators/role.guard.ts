// import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
// import RequestWithUser from './requestWithUser.interface';
// import { UserRole } from 'src/modules/users/schemas/user.schema';

// const RoleGuard = (role: UserRole): Type<CanActivate> => {
// 	class RoleGuardMixin implements CanActivate {
// 		canActivate(context: ExecutionContext) {
// 			const request = context.switchToHttp().getRequest<RequestWithUser>();
// 			const user = request.user;
// 			return user?.role.includes(role) || user?.role.includes(UserRole.ADMIN);
// 		}
// 	}

// 	return mixin(RoleGuardMixin);
// };

// export default RoleGuard;

// //Tham khao tu
// //https://wanago.io/2021/11/15/api-nestjs-authorization-roles-claims/

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './role.decorator';
import { UserRole } from 'src/modules/users/schemas/user.schema';
import RequestWithUser from './requestWithUser.interface';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()],
		);
		console.log(requiredRoles);
		if (!requiredRoles) {
			return true;
		}
		const user = context.switchToHttp().getRequest<RequestWithUser>().user;
		return requiredRoles.some((role) => user.role?.includes(role));
	}
}
