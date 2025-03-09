import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  HttpStatus,
  Put,
  ConflictException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async createProductController(
    @Body() createProductDto: CreateProductDto,
    @Res() res: Response,
  ) {
    try {
      const data =
        await this.productsService.createProductItem(createProductDto);
      res.status(HttpStatus.CREATED).json({ data });
    } catch (error: unknown) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error });
    }
  }

  @Get()
  async getAllProductsController(@Res() res: Response) {
    try {
      return res
        .status(HttpStatus.OK)
        .json(await this.productsService.getAllProductsItems());
    } catch (error: unknown) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error });
    }
  }

  @Get('/:id')
  async getProductController(@Param('id') id: number) {
    return await this.productsService.getProductItem(id);
  }

  @Put('/:id')
  async updateProductController(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.productsService.updateProductItem(
        id,
        updateProductDto,
      );
      res.status(HttpStatus.OK).json({ data });
    } catch (error: unknown) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error });
    }
  }
  @Delete('/:id')
  async deleteProductController(@Param('id') id: number, @Res() res: Response) {
    try {
      return await this.productsService.deleteProductItem(id);
      res
        .status(HttpStatus.NO_CONTENT)
        .json({ message: 'Has been eliminated succefully that product' });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code == 'P2025') {
          throw new ConflictException('There is not record with that product');
        }
      }
    }
  }
}
