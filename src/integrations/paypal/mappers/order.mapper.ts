import { Prisma } from '@prisma/client';
import { CreateOrderDto } from "../orders/dto/create-order.dto";

export function mapToOrderCreateInput(dto:CreateOrderDto): Prisma.OrderCreateInput {

    return {
        intent:dto.intent,
        purchase_units:dto.purchase_units,
        application_context: dto.application_context,
    }

}