import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUserController(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUserItem(createUserDto);
  }

  @Get()
  getUsersController() {
    return this.usersService.getAllUserItems();
  }

  @Get(':id')
  getUserController(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserItem(id);
  }

  @Patch(':id')
  updateUserController(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUserItem(id, updateUserDto);
  }

  @Delete(':id')
  deleteUserController(@Param('id') id: number) {
    return this.usersService.deleteUserItem(id);
  }
}
