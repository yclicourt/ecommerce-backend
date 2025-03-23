import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  ParseIntPipe,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Role } from 'src/auth/enums/role.enum';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('products')
@UseGuards(AuthGuard,RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(Role.ADMIN)
  createProductController(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProductItem(createProductDto);
  }

  @Get()
  @Roles(Role.USER)
  getAllProductsController() {
    return this.productsService.getAllProductsItems();
  }

  @Get(':id')
  @Roles(Role.USER)
  async getProductController(@Param('id', ParseIntPipe) id: number) {
    const productFound = await this.productsService.getProductItem(id);

    if (!productFound) throw new HttpException('Product not found', 404);

    return productFound;
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  async updateProductController(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateProductItem(id, updateProductDto);
  }
  @Delete(':id')
  @Roles(Role.ADMIN)
  async deleteProductController(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteProductItem(id);
  }
}
