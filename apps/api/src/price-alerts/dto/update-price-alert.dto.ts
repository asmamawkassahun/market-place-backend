import { PartialType } from '@nestjs/mapped-types';
import { CreatePriceAlertDto } from './create-price-alert.dto';

export class UpdatePriceAlertDto extends PartialType(CreatePriceAlertDto) {}
