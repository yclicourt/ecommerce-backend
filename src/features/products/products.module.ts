import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { FileUploadService } from 'src/common/file-upload/file-upload.service';
import { CategoriesService } from '../categories/categories.service';
import { ConfigService } from '@nestjs/config';


@Module({
  imports: [PrismaModule],
  controllers: [ProductsController],
  providers: [ProductsService,FileUploadService,CategoriesService,ConfigService],
})
export class ProductsModule {}
