import { Product } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsObject,
  ValidateNested,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

class AmountDto {
  @IsString()
  @IsNotEmpty()
  currency_code: string;
  @IsString()
  @IsNotEmpty()
  value: string;
}

export class PurchaseUnitDto {
  [key: string]: any;
  @IsString()
  @IsOptional()
  reference_id?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  custom_id?: string;

  @IsString()
  @IsOptional()
  invoice_id?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => AmountDto)
  amount: AmountDto;

  @IsOptional()
  items?: Product;
}
