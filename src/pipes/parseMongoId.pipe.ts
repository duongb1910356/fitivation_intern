import {
	ArgumentMetadata,
	BadRequestException,
	Injectable,
	PipeTransform,
} from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class MongoIdValidationPipe implements PipeTransform {
	transform(value: any, metadata: ArgumentMetadata) {
		console.log(value, metadata);
		if (!Types.ObjectId.isValid(value)) {
			throw new BadRequestException(`Invalid ${metadata.data}`);
		}
		return value;
	}
}
