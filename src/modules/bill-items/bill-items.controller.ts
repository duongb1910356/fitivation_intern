import { Controller } from '@nestjs/common';
import { BillItemsService } from './bill-items.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('bill-items')
@ApiTags('bill-items')
@ApiBearerAuth()
export class BillItemsController {
	constructor(private readonly billItemsService: BillItemsService) {}
}
