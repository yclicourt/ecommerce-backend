import { Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('create-order')
  createOrderController() {
    return this.ordersService.createOrderItem();
  }

  @Post('capture-order')
  captureOrderController() {}

  @Post('cancel-order')
  CancelOrder() {}
}
