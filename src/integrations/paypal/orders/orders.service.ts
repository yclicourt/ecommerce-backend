/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
import { PayPalOrderResponse } from './interfaces/paypal-order-response.interface';
import { PurchaseUnitDto } from './dto/purchase-unit.dto';
import { PaypalCreateOrderDto } from './dto/create-order.dto';
import { PayPalCaptureOrderResponse } from './interfaces/paypal-capture-order-response.interface';
import { MailService } from 'src/integrations/mail/mail.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async createOrderItem(prisma: PaypalCreateOrderDto) {
    // Creating order in Paypal
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    // Getting a access token
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

    const purchaseUnits = prisma.purchase_units.map(
      (unit, index): PurchaseUnitDto => ({
        reference_id: unit.reference_id || `ref_${index}_${Date.now()}`,
        amount: {
          currency_code: 'USD',
          value: unit.amount.value,
          breakdown: {
            item_total: {
              currency_code: 'USD',
              value: unit.amount.value,
            },
          },
        },
        items:
          unit.items?.map((item) => ({
            name: item.name.substring(0, 127),
            unit_amount: {
              currency_code: 'USD',
              value: item.unit_amount.value,
            },
            quantity: item.quantity.toString(),
            description: item.description?.substring(0, 127) || '',
          })) || [], // Array vacío como fallback
      }),
    );

    // Create order in Paypal
    const paypalOrderPayload: PaypalCreateOrderDto = {
      intent: prisma.intent || 'CAPTURE',
      purchase_units: purchaseUnits,
      application_context: prisma.application_context || {
        return_url: `${process.env.ORIGIN_CLIENT}/order/success`,
        cancel_url: `${process.env.ORIGIN_CLIENT}/order/cancel`,
        brand_name: process.env.BRAND_NAME || 'My Store',
        user_action: 'PAY_NOW',
        shipping_preference: 'NO_SHIPPING', // O 'GET_FROM_FILE' si necesitas envío
      },
    };
    const paypalResponse = await axios.post<PayPalOrderResponse>(
      `${PAYPAL_API}/v2/checkout/orders`,
      paypalOrderPayload,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    try {
      // Save into database
      const newOrder = await this.prisma.order.create({
        data: {
          paypalOrderId: paypalResponse.data.id,
          intent: paypalOrderPayload.intent,
          purchase_units:
            paypalOrderPayload.purchase_units as Prisma.InputJsonValue[],
          application_context:
            paypalOrderPayload.application_context as Prisma.InputJsonValue,
          statusOrder: paypalResponse.data.status,
        },
      });

      return {
        ...newOrder,
        approval_url:
          paypalResponse.data.links.find((link) => link.rel === 'approve')
            ?.href ?? null,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new HttpException(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          error.response?.data?.message || 'PayPal API Error',
          error.response?.status || 500,
        );
      }
      throw error;
    }
  }

  async captureOrder(token: string) {
    // Capture a payment in Paypal
    const response = await axios.post<PayPalCaptureOrderResponse>(
      `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
      {},
      {
        auth: {
          username: PAYPAL_API_CLIENT,
          password: PAYPAL_API_SECRET,
        },
      },
    );

    // Save into database
    try {
      const savedTransactionOrder = await this.prisma.transaction.create({
        data: {
          payer: response.data.payer as Prisma.InputJsonValue,
          purchase_units: response.data
            .purchase_units as Prisma.InputJsonValue[],
          statusTransactions: response.data.status,
        },
      });

      // Send confirmation email
      await this.mailService.sendConfirmationOrderEmail({
        ...response.data,
        id: savedTransactionOrder.id,
      });
      return savedTransactionOrder;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new HttpException(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          error.response?.data?.message || 'PayPal API Error',
          error.response?.status || 500,
        );
      }
      throw error;
    }
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
