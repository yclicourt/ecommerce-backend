import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { INTENT } from '../../enums/order.enum';
import { PurchaseUnitDto } from './purchase-unit.dto';
import { ApplicationContextDto } from './application-context.dto';
import { Prisma } from '@prisma/client';

export class CreateOrderDto implements Partial<Prisma.OrderCreateInput> {
  @IsEnum(INTENT)
  @IsNotEmpty()
  intent: INTENT;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseUnitDto)
  purchase_units: PurchaseUnitDto[];

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => ApplicationContextDto)
  application_context: ApplicationContextDto;
}
