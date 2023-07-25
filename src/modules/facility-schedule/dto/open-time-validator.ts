import { registerDecorator, ValidationOptions } from 'class-validator';
import { ShiftTimeDto } from './shift-time-dto';
import { BadRequestException } from '@nestjs/common';

export function ValidateShiftsOverlap(validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: 'validateShiftsOverlap',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: {
				validate(value: any[]) {
					if (value.length < 2) {
						return true;
					}

					const shifts = value as ShiftTimeDto[];
					const sortedShifts = [...shifts].sort(
						(a, b) =>
							new Date(`2000-01-01 ${a.startTime}:00.000Z`).getTime() -
							new Date(`2000-01-01 ${b.startTime}:00.000Z`).getTime(),
					);

					for (let i = 0; i < sortedShifts.length - 1; i++) {
						const currentShift = sortedShifts[i];
						const nextShift = sortedShifts[i + 1];
						const endTimeCurrent = new Date(
							`2000-01-01 ${currentShift}:00.000Z`,
						);
						const startTimeNext = new Date(`2000-01-01 ${nextShift}:00.000Z`);

						if (endTimeCurrent >= startTimeNext) {
							throw new BadRequestException('Shifts must not overlap');
						}
					}

					return true;
				},
			},
		});
	};
}
