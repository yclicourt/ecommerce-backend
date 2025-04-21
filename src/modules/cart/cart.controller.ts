import { Controller, Post, Body } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Create a cart' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  createCartController(@Body() createCartDto: CreateCartDto) {
    return this.cartService.addItemToCart(createCartDto);
  }
}
