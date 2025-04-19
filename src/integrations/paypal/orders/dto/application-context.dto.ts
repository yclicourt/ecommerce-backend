import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ApplicationContextDto {
  [key: string]: any;
  @IsString()
  @IsOptional()
  return_url?: string;

  @IsString()
  @IsOptional()
  cancel_url?: string;

  @IsString()
  @IsNotEmpty()
  brand_name: string;

  @IsString()
  @IsNotEmpty()
  landing_page: string;

  @IsString({})
  @IsNotEmpty()
  user_action: string;
}
