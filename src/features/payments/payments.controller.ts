import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a payment' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a payment' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }
}
