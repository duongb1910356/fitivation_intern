import {
	CountObject,
	Counter,
	TargetObject,
} from '../../entities/counter.entity';

export const CounterStub = (): Counter => {
	return {
		_id: '6493cd02a6a031e19d380fac',
		targetObject: TargetObject.FACILITY,
		targetID: '64931e19d380fac3cd02a6a0',
		countObject: CountObject.PACKAGE_TYPE,
		count: 2,
		createdAt: new Date('2023-06-22T04:24:34.315Z'),
		updatedAt: new Date('2023-06-22T04:24:34.315Z'),
	};
};
