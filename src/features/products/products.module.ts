import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { FileUploadService } from 'src/common/file-upload/file-upload.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProductsController],
  providers: [ProductsService,FileUploadService],
})
export class ProductsModule {}
