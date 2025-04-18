import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'name user',
    example: 'john',
  })
  name?: string;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'lastname user',
    example: 'mcmillan',
  })
  lastname?: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'email user',
    example: 'test@mail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'address user',
    example: 'some avenie 123',
  })
  address: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({
    description: 'password user',
    example: 'mypassword',
  })
  password: string;
}
