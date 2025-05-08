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
import { Role } from '../auth/common/enums/role.enum';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
@ApiUnauthorizedResponse({
  description: 'Unauthorized Bearer Auth',
})
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(Role.ADMIN,Role.MANAGER)
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create products' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: CreateProductDto })
  createProductController(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProductItem(createProductDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: 'Product',
  })
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getAllProductsController() {
    return this.productsService.getAllProductsItems();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: 'Product',
  })
  @ApiOperation({ summary: 'Get a product' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getProductController(@Param('id', ParseIntPipe) id: number) {
    const productFound = await this.productsService.getProductItem(id);

    if (!productFound) throw new HttpException('Product not found', 404);

    return productFound;
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async updateProductController(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateProductItem(id, updateProductDto);
  }
  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async deleteProductController(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteProductItem(id);
  }
}
