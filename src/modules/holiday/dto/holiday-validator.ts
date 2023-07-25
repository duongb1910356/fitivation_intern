import { BadRequestException } from '@nestjs/common';
import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
} from 'class-validator';

export function IsStartDateBeforeEndDate(
	validationOptions?: ValidationOptions,
) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: 'isStartDateBeforeEndDate',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					const startDate = new Date(value);
					const endDate = new Date(args.object['endDate']);

					if (startDate >= endDate)
						throw new BadRequestException(`startDate must be before endDate`);
					return true;
				},
			},
		});
	};
}
