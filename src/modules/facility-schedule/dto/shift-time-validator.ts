import { BadRequestException } from '@nestjs/common';
import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
} from 'class-validator';

export function IsStartTimeBeforeEndTime(
	validationOptions?: ValidationOptions,
) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: 'isStartTimeBeforeEndTime',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					const startTime = value;
					const endTime = args.object['endTime'];

					if (startTime > endTime)
						throw new BadRequestException(`startTime must be before endTime`);
					return true;
				},
			},
		});
	};
}
