import { PartialType } from '@nestjs/mapped-types';
import { CreateGiftRegistryDto } from './create-gift-registry.dto';

export class UpdateGiftRegistryDto extends PartialType(CreateGiftRegistryDto) {}
