import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CategoriesResolver } from './categories.resolver';

@Module({
  imports: [PrismaModule],
  providers: [CategoriesService, CategoriesResolver],
})
export class CategoriesModule {}
