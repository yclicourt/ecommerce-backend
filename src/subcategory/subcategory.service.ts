import { Injectable } from '@nestjs/common';
import { CreateSubcategoryInput } from './dto/create-subcategory.input';
import { UpdateSubcategoryInput } from './dto/update-subcategory.input';

@Injectable()
export class SubcategoryService {
  create(createSubcategoryInput: CreateSubcategoryInput) {
    return 'This action adds a new subcategory';
  }

  findAll() {
    return `This action returns all subcategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subcategory`;
  }

  update(id: number, updateSubcategoryInput: UpdateSubcategoryInput) {
    return `This action updates a #${id} subcategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} subcategory`;
  }
}
