import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { FacilityScheduleService } from 'src/modules/facility-schedule/facility-schedule.service';

@Injectable()
export class OwnershipScheduleGuard implements CanActivate {
	constructor(private readonly scheduleService: FacilityScheduleService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const { scheduleID } = request.params;
		const user = request.user;

		const isOwner = await this.scheduleService.isOwner(scheduleID, user.uid);

		return isOwner;
	}
}
