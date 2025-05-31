import { HttpException, Injectable } from '@nestjs/common';
import {
  PAYPAL_API,
  PAYPAL_API_CLIENT,
  PAYPAL_API_SECRET,
} from 'src/config/app.config';
import axios from 'axios';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrderItem(prisma: Prisma.OrderCreateInput) {
    const newOrder = await this.prisma.order.create({
      data: {
        intent: prisma.intent,
        purchase_units: prisma.purchase_units,
        application_context: prisma.application_context,
      },
    });

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    const response = await axios.post<{ access_token: string }>(
      `${PAYPAL_API}/v1/oauth2/token`,
      params,
      {
        auth: {
          username: PAYPAL_API_CLIENT,
          password: PAYPAL_API_SECRET,
        },
      },
    );
    const { access_token } = response.data;
    await axios.post(`${PAYPAL_API}/v2/checkout/orders`, newOrder, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return newOrder;
  }

  async captureOrder(token: string) {
    await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
      {},
      {
        auth: {
          username: PAYPAL_API_CLIENT,
          password: PAYPAL_API_SECRET,
        },
      },
    );
  }

  async getAllOrdersItem() {
    return await this.prisma.order.findMany();
  }

  async getOrderItem(id: number) {
    const orderFounded = await this.prisma.order.findUnique({
      where: {
        id,
      },
    });
    if (!orderFounded) throw new HttpException('Order not found', 404);

    return orderFounded;
  }

  async updateOrderItem(id: number, updateOrderDto: UpdateOrderDto) {
    const orderFounded = await this.getOrderItem(id);
    if (!orderFounded) throw new HttpException('Order not found', 404);
    const orderUpdated = await this.prisma.order.update({
      where: {
        id: orderFounded.id,
      },
      data: {
        application_context: updateOrderDto.application_context,
        intent: updateOrderDto.intent,
        purchase_units: updateOrderDto.purchase_units,
      },
    });
    return orderUpdated;
  }

  async deleteOrderItem(id: number) {
    const orderFounded = await this.getOrderItem(id);
    if (!orderFounded) throw new HttpException('Order not found', 404);
    await this.prisma.order.delete({
      where: {
        id,
      },
    });
  }
}
