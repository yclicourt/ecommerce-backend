import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { CreateCategoryInputDto } from './dto/create-category.dto';
import { Category } from './entity/category.entity';

@Resolver()
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Mutation((returns) => Category)
  createCategoryResolver(
    @Args('categoryInput') createCategoryInputDto: CreateCategoryInputDto,
  ) {
    return this.categoriesService.createCategoryItem(createCategoryInputDto);
  }

  @Query((returns) => [Category])
  getAllCategoryResolver() {
    return this.categoriesService.getAllCategoriesItems();
  }

  @Query((returns) => Category)
  getCategoryResolver(@Args('id', { type: () => Int }) id: number) {
    return this.categoriesService.getCategoryItem(id);
  }

}
