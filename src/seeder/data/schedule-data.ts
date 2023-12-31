import { dayOfWeek } from 'src/modules/facility-schedule/entities/open-time.entity';
import { ScheduleType } from 'src/modules/facility/schemas/facility.schema';

export const scheduleData = [
	{
		_id: '64b4aff0f4f2b881b96475ea',
		facilityID: '649d344f72e91c40d2e7e895',
		type: ScheduleType.DAILY,
		openTime: [
			{
				shift: [
					{
						startTime: '06:00',
						endTime: '12:00',
					},
					{
						startTime: '13:00',
						endTime: '19:00',
					},
				],
			},
		],
		createdAt: '2023-06-29T08:23:34.856Z',
		updatedAt: '2023-06-29T08:23:34.856Z',
	},
	{
		_id: '64b0cd9f9fe7ffe0a6c2038f',
		facilityID: '649d390172e91c40d2e7e8fb',
		type: ScheduleType.WEEKLY,
		openTime: [
			{
				shift: [
					{
						startTime: '06:00',
						endTime: '12:00',
					},
					{
						startTime: '13:00',
						endTime: '19:00',
					},
				],
				dayOfWeek: dayOfWeek.MONDAY,
			},
			{
				shift: [
					{
						startTime: '06:00',
						endTime: '12:00',
					},
					{
						startTime: '13:00',
						endTime: '19:00',
					},
				],
				dayOfWeek: dayOfWeek.TUESDAY,
			},
			{
				shift: [
					{
						startTime: '06:00',
						endTime: '12:00',
					},
					{
						startTime: '13:00',
						endTime: '19:00',
					},
				],
				dayOfWeek: dayOfWeek.WEDNESDAY,
			},
			{
				shift: [
					{
						startTime: '06:00',
						endTime: '12:00',
					},
					{
						startTime: '13:00',
						endTime: '19:00',
					},
				],
				dayOfWeek: dayOfWeek.THURSDAY,
			},
			{
				shift: [
					{
						startTime: '06:00',
						endTime: '12:00',
					},
					{
						startTime: '13:00',
						endTime: '19:00',
					},
				],
				dayOfWeek: dayOfWeek.FRIDAY,
			},
		],
		createdAt: '2023-06-29T08:23:34.856Z',
		updatedAt: '2023-06-29T08:23:34.856Z',
	},
	{
		_id: '64b0cd9f9fe7ffe0a6c20390',
		facilityID: '649d3a0d72e91c40d2e7e946',
		type: ScheduleType.WEEKLY,
		openTime: [
			{
				shift: [
					{
						startTime: '06:00',
						endTime: '12:00',
					},
					{
						startTime: '13:00',
						endTime: '19:00',
					},
				],
				dayOfWeek: dayOfWeek.MONDAY,
			},
			{
				shift: [
					{
						startTime: '06:00',
						endTime: '12:00',
					},
					{
						startTime: '13:00',
						endTime: '19:00',
					},
				],
				dayOfWeek: dayOfWeek.TUESDAY,
			},
			{
				shift: [
					{
						startTime: '06:00',
						endTime: '12:00',
					},
					{
						startTime: '13:00',
						endTime: '19:00',
					},
				],
				dayOfWeek: dayOfWeek.WEDNESDAY,
			},
			{
				shift: [
					{
						startTime: '06:00',
						endTime: '12:00',
					},
					{
						startTime: '13:00',
						endTime: '19:00',
					},
				],
				dayOfWeek: dayOfWeek.THURSDAY,
			},
			{
				shift: [
					{
						startTime: '06:00',
						endTime: '12:00',
					},
					{
						startTime: '13:00',
						endTime: '19:00',
					},
				],
				dayOfWeek: dayOfWeek.FRIDAY,
			},
		],
		createdAt: '2023-06-29T08:23:34.856Z',
		updatedAt: '2023-06-29T08:23:34.856Z',
	},
	{
		facilityID: '649d344f72e91c40d2e7e895',
		type: ScheduleType.WEEKLY,
		openTime: [
			{
				shift: [
					{
						startTime: '06:00',
						endTime: '12:00',
					},
					{
						startTime: '13:00',
						endTime: '19:00',
					},
				],
				dayOfWeek: dayOfWeek.MONDAY,
			},
			{
				shift: [
					{
						startTime: '06:00',
						endTime: '12:00',
					},
					{
						startTime: '13:00',
						endTime: '19:00',
					},
				],
				dayOfWeek: dayOfWeek.TUESDAY,
			},
			{
				shift: [
					{
						startTime: '06:00',
						endTime: '12:00',
					},
					{
						startTime: '13:00',
						endTime: '19:00',
					},
				],
				dayOfWeek: dayOfWeek.WEDNESDAY,
			},
			{
				shift: [
					{
						startTime: '06:00',
						endTime: '12:00',
					},
					{
						startTime: '13:00',
						endTime: '19:00',
					},
				],
				dayOfWeek: dayOfWeek.THURSDAY,
			},
			{
				shift: [
					{
						startTime: '06:00',
						endTime: '12:00',
					},
					{
						startTime: '13:00',
						endTime: '19:00',
					},
				],
				dayOfWeek: dayOfWeek.FRIDAY,
			},
		],
		createdAt: '2023-06-29T08:23:34.856Z',
		updatedAt: '2023-06-29T08:23:34.856Z',
	},
];
