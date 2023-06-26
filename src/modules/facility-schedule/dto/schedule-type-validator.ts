import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
} from 'class-validator';
import { ScheduleType } from '../entities/facility-schedule.entity';
import { OpenTimeDto } from './open-time-dto';
import { BadRequestException } from '@nestjs/common';

export function ValidateScheduleType(validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: 'validateScheduleType',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					const openTime = value as OpenTimeDto[];
					const type = args.object['type'];

					switch (type) {
						case ScheduleType.DAILY:
							console.log('daily');
							openTime.forEach((item) => {
								if (
									item.hasOwnProperty('dayOfMonth') ||
									item.hasOwnProperty('dayOfWeek')
								) {
									throw new BadRequestException(
										'openTime must not have dayOfMonth and dayOfWeek',
									);
								}
							});
							break;
						case ScheduleType.WEEKLY:
							console.log('weekly');
							openTime.forEach((item) => {
								if (
									item.hasOwnProperty('dayOfMonth') ||
									!item.hasOwnProperty('dayOfWeek')
								) {
									throw new BadRequestException('openTime invalid');
								}
							});
							break;
						case ScheduleType.MONTHLY:
							console.log('monthly');
							openTime.forEach((item) => {
								if (
									!item.hasOwnProperty('dayOfMonth') ||
									item.hasOwnProperty('dayOfWeek')
								) {
									throw new BadRequestException('openTime invalid');
								}
							});
							break;
					}

					return true;
				},
			},
		});
	};
}
