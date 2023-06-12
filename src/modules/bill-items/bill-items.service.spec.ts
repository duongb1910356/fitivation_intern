import { Test, TestingModule } from '@nestjs/testing';
import { BillItemsService } from './bill-items.service';

describe('BillItemsService', () => {
  let service: BillItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillItemsService],
    }).compile();

    service = module.get<BillItemsService>(BillItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
