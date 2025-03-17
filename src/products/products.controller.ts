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
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  createProductController(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProductItem(createProductDto);
  }

  @Get()
  getAllProductsController() {
    return this.productsService.getAllProductsItems();
  }

  @Get(':id')
  async getProductController(@Param('id', ParseIntPipe) id: number) {
    const productFound = await this.productsService.getProductItem(id);

    if (!productFound)
      throw new HttpException(`There is not product with that id ${id}`, 404);

    return productFound;
  }

  @Patch(':id')
  async updateProductController(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateProductItem(id, updateProductDto);
  }
  @Delete(':id')
  async deleteProductController(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteProductItem(id);
  }
}
