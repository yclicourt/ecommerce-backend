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
  UseInterceptors,
  UploadedFile,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/common/file-upload/file-upload.service';

@ApiTags('products')
@Controller('products')
@ApiUnauthorizedResponse({
  description: 'Unauthorized Bearer Auth',
})
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create products' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: CreateProductDto })
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async createProductController(
    @UploadedFile() image: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    try {
      let imageProductUrl: string | undefined = undefined;

      if (image) {
        const fileName = await this.fileUploadService.uploadFile(image);
        imageProductUrl = `/uploads/${fileName}`;
      }

      const createData = {
        ...createProductDto,
        ...(imageProductUrl && { image: imageProductUrl }),
      };
      return this.productsService.createProductItem(createData);
    } catch (error) {
      console.error('Error in createUserController:', error);
      throw error;
    }
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
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async updateProductController(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() image: Express.Multer.File,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      let imageProductUrl: string | undefined = undefined;

      if (image) {
        const fileName = await this.fileUploadService.uploadFile(image);
        imageProductUrl = `/uploads/${fileName}`;
      }

      const updateData = {
        ...updateProductDto,
        ...(imageProductUrl && { image: imageProductUrl }),
      };
      return this.productsService.updateProductItem(id, updateData);
    } catch (error) {
      console.error('Error in createUserController:', error);
      throw error;
    }
  }
  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async deleteProductController(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteProductItem(id);
  }
}
