import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      status: true,
      message: 'Tạo người dùng thành công',
      data: user,
    };
  }

  @Get()
  async findAll() {
    const user = await this.usersService.findAll();
    return {
      status: true,
      message: 'Lấy danh sách người dùng thành công',
      data: user,
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(Number(id), updateUserDto);
    return {
      status: true,
      message: 'Cập nhật người dùng thành công',
      data: user,
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.usersService.delete(Number(id));
    return {
      status: true,
      message: 'Xóa người dùng thành công',
    };
  }
}
