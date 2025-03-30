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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  createUserController(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUserItem(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getUsersController() {
    return this.usersService.getAllUserItems();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getUserController(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserItem(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  updateUserController(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUserItem(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  deleteUserController(@Param('id') id: number) {
    return this.usersService.deleteUserItem(id);
  }
}
