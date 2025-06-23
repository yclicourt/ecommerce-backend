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
  BadRequestException,
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
import { CategoriesService } from '../categories/categories.service';
import { CategoryName } from '../categories/enums/category-name.enum';

@ApiTags('products')
@Controller('products')
@ApiUnauthorizedResponse({
  description: 'Unauthorized Bearer Auth',
})
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly fileUploadService: FileUploadService,
    private readonly categoriesService: CategoriesService,
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
      let categories: Array<{ name: CategoryName; description?: string }> = [];

      // Parse categories if exists
      if (createProductDto.categories) {
        try {
          categories = JSON.parse(createProductDto.categories) as Array<{
            name: CategoryName;
            description?: string;
          }>;
        } catch (e) {
          console.log(e);
          throw new BadRequestException(
            'Invalid category format. Must be a Array JSON ',
          );
        }
      }

      if (image) {
        const fileName = await this.fileUploadService.uploadFile(image);
        imageProductUrl =
          process.env.NODE_ENV === 'production' && (fileName.startsWith('http') || fileName.startsWith('https'))
            ? fileName // Cloudinary URL
            : `/uploads/${fileName}`; // Local file path
      }

      const createData = {
        ...createProductDto,
        categories,
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
      let categories: Array<{ name: CategoryName; description?: string }> = [];

      // Parse categories if exists
      if (updateProductDto.categories) {
        try {
          if (typeof updateProductDto.categories === 'string') {
            categories = JSON.parse(updateProductDto.categories) as Array<{
              name: CategoryName;
              description?: string;
            }>;
          } else {
            categories = updateProductDto.categories;
          }
        } catch (e) {
          console.log(e);
          throw new BadRequestException(
            'Invalid category format. Must be a Array JSON ',
          );
        }
      }

      if (image) {
        const fileName = await this.fileUploadService.uploadFile(image);
        imageProductUrl =
          process.env.NODE_ENV === 'production' && (fileName.startsWith('http') || fileName.startsWith('https'))
            ? fileName // Cloudinary URL
            : `/uploads/${fileName}`; // Local file path
      }
      const updateData = {
        ...updateProductDto,
        categories,
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
