import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { FacilityService } from 'src/modules/facility/facility.service';

@Injectable()
export class OwnershipFacilityGuard implements CanActivate {
	constructor(private readonly facilityService: FacilityService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const { facilityID } = request.params;
		const user = request.user;

		const isOwner = await this.facilityService.isOwner(facilityID, user.uid);

		return isOwner;
	}
}
