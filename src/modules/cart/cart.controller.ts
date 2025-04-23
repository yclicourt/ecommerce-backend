import { Controller, Post, Body, Get } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CartItemDto } from './dto/cart-item.dto';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Create a cart' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  addItemCartController(@Body() createCartDto: CreateCartDto) {
    return this.cartService.addItemToCart(createCartDto);
  }

  @Get()
  disponibilityStockController(
    @Body() createCartDto: CreateCartDto,
    cartItemDto: CartItemDto,
  ) {
    return this.cartService.validateDisponibilityStock(
      createCartDto,
      cartItemDto,
    );
  }
}
