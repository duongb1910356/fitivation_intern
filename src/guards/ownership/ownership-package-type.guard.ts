import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PackageTypeService } from 'src/modules/package-type/package-type.service';

@Injectable()
export class OwnershipPackageTypeGuard implements CanActivate {
	constructor(private packageTypeService: PackageTypeService) {}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const { packageTypeID } = request.params;
		const user = request.user;

		const packageType = await this.packageTypeService.findById(packageTypeID, {
			path: 'facilityID',
		});

		request.facilityID = packageType.facilityID._id.toString();
		const owner = packageType.facilityID.ownerID.toString();

		return user.uid === owner;
	}
}
