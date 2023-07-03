import { CounterStub } from '../test/stubs/counter.stub';

export const CounterService = jest.fn().mockReturnValue({
	findOneByCondition: jest.fn().mockResolvedValue(CounterStub()),
	create: jest.fn().mockResolvedValue(CounterStub()),
	increase: jest.fn().mockResolvedValue(CounterStub()),
	decrease: jest.fn().mockResolvedValue(CounterStub()),
	delete: jest.fn().mockResolvedValue(true),
});
