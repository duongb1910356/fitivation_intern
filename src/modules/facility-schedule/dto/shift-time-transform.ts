import { BadRequestException } from '@nestjs/common';
import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
} from 'class-validator';

export function ShiftTimeTransform(validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: 'isStartTimeBeforeEndTime',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					const timeRegex = /^(0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
					let startTime = value;
					let endTime = args.object['endTime'];
					if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
						throw new BadRequestException(
							'Invalid time format. Please use the format HH:mm (24-hour)',
						);
					}

					startTime = new Date(`2000-01-01 ${value}:00.000Z`);
					endTime = new Date(`2000-01-01 ${args.object['endTime']}:00.000Z`);
					if (startTime > endTime)
						throw new BadRequestException(`startTime must be before endTime`);

					return true;
				},
			},
		});
	};
}
