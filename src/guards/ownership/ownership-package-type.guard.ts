import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PackageTypeService } from 'src/modules/package-type/package-type.service';

@Injectable()
export class OwnershipPackageTypeGuard implements CanActivate {
	constructor(private packageTypeService: PackageTypeService) {}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const { packageTypeID } = request.params;
		const user = request.user;

		const isOwner = await this.packageTypeService.isOwner(
			packageTypeID,
			user.sub,
		);

		return isOwner;
	}
}
