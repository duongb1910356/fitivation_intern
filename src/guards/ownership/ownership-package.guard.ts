import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PackageService } from 'src/modules/package/package.service';

@Injectable()
export class OwnershipPackageGuard implements CanActivate {
	constructor(private readonly packageService: PackageService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const { packageID } = request.params;
		const user = request.user;

		const packageData = await this.packageService.findById(packageID, {
			path: 'facilityID',
		});

		const owner = packageData.facilityID.ownerID.toString();

		return user.uid === owner;
	}
}
