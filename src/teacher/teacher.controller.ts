import { Controller, Post, Body, Get, Param, Query, BadRequestException } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { LoginTeacherDto } from './dto/login-teacher.dto';

@Controller('teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post('register')
  async create(@Body() createTeacherDto: CreateTeacherDto) {
    const teacher = await this.teacherService.create(createTeacherDto);
    return {
      status: true,
      message: 'Đăng ký giáo viên thành công',
      data: teacher,
    };
  }

  @Post('login')
  async login(@Body() loginTeacherDto: LoginTeacherDto) {
    const teacher = await this.teacherService.login(loginTeacherDto);
    return {
      status: true,
      message: 'Đăng nhập thành công',
      data: teacher,
    };
  }

  @Get()
  async findAll() {
    const teachers = await this.teacherService.findAll();
    return {
      status: true,
      message: 'Lấy danh sách giáo viên thành công',
      data: teachers,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const teacher = await this.teacherService.findOne(Number(id));
    return {
      status: true,
      message: 'Lấy thông tin giáo viên thành công',
      data: teacher,
    };
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    const teacher = await this.teacherService.verifyEmail(token);
    return {
      status: true,
      message: 'Xác thực email thành công',
      data: teacher,
    };
  }

  @Post('verify-email')
  async verifyEmailPost(@Body() body: { token?: string }) {
    if (!body?.token) {
      throw new BadRequestException('Token xác thực không được để trống');
    }
    const teacher = await this.teacherService.verifyEmail(body.token);
    return {
      status: true,
      message: 'Xác thực email thành công',
      data: teacher,
    };
  }
}
