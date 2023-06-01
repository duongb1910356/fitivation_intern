import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/modules/users/schemas/user.schema';
import RequestWithUser from './requestWithUser.interface';
import { ROLES_KEY } from './role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()],
		);
		if (!requiredRoles) {
			return true;
		}
		const user = context.switchToHttp().getRequest<RequestWithUser>().user;
		//default check ADMIN
		if (user.role?.includes(UserRole.ADMIN)) {
			return true;
		}
		return requiredRoles.some((role) => user.role?.includes(role));
	}
}
