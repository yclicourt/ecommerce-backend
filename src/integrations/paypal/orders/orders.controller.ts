import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { mapToOrderCreateInput } from '../mappers/order.mapper';
import { Response } from 'express';
import { HOST } from 'src/config/app.config';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('create-order')
  createOrderController(@Body() createOrderDto: CreateOrderDto) {
    const orderInput = mapToOrderCreateInput(createOrderDto);
    return this.ordersService.createOrderItem(orderInput);
  }

  @Get('capture-order')
  captureOrderController(@Query('token') token: string) {
    return this.ordersService.captureOrder(token);
  }

  @Get('cancel-order')
  cancelOrder(@Res() res:Response) {
    res.status(302).redirect(`${HOST}/orders/create-order`)
  }
}
