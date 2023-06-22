import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { HolidayService } from 'src/modules/holiday/holiday.service';

@Injectable()
export class OwnershipHolidayGuard implements CanActivate {
	constructor(private holidayService: HolidayService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const { holidayID } = request.params;
		const user = request.user;

		const isOwner = await this.holidayService.isOwnership(holidayID, user.uid);

		return isOwner;
	}
}
