import { Injectable } from '@nestjs/common';
import {
  HOST,
  PAYPAL_API,
  PAYPAL_API_CLIENT,
  PAYPAL_API_SECRET,
} from 'src/config/app.config';
import axios from 'axios';

@Injectable()
export class OrdersService {
  async createOrderItem() {
    const newOrder = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: '230.00',
          },
        },
      ],
      application_context: {
        brand_name: 'Ecommerce API',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${HOST}/capture-order`,
        cancel_url: `${HOST}/cancel-order`,
      },
    };

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
    await axios.post(`${PAYPAL_API}/v2/checkout/orders`, newOrder, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return newOrder;
  }

  captureOrder() {
    
  }

  cancelOrder() {}
}
