import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/modules/users/schemas/user.schema';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import { ROLES_KEY } from 'src/decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()],
		);
		const { user } = context.switchToHttp().getRequest<RequestWithUser>();
		return requiredRoles.some((role) => user.role?.includes(role));
	}
}
