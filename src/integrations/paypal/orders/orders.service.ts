import { Injectable } from '@nestjs/common';
import {
  PAYPAL_API,
  PAYPAL_API_CLIENT,
  PAYPAL_API_SECRET,
} from 'src/config/app.config';
import axios from 'axios';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

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

    console.log(newOrder);

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    const {
      data: { access_token },
    } = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, params, {
      auth: {
        username: PAYPAL_API_CLIENT,
        password: PAYPAL_API_SECRET,
      },
    });
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      newOrder,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    console.log(response.data.links);
    return newOrder;
  }

  async captureOrder(token: string) {
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
      {},
      {
        auth: {
          username: PAYPAL_API_CLIENT,
          password: PAYPAL_API_SECRET,
        },
      },
    );

    console.log(response.data);
  }

  
}
