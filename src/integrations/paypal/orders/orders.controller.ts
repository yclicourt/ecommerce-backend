import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { mapToOrderCreateInput } from '../mappers/order.mapper';
import { Response } from 'express';
import { HOST } from 'src/config/app.config';
import { UpdateOrderDto } from './dto/update-order.dto';

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
  cancelOrder(@Res() res: Response) {
    res.status(302).redirect(`${HOST}/orders/create-order`);
  }

  @Get()
  getAllOrdersController() {
    return this.ordersService.getAllOrdersItem();
  }

  @Get(':id')
  getOrderController(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.getOrderItem(id);
  }

  @Patch(':id')
  updateOrderController(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.updateOrderItem(id, updateOrderDto);
  }

  @Delete(':id')
  deleteOrderController(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.deleteOrderItem(id);
  }
}
