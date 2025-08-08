import { Controller, Post, Body, Get, Param, Query, BadRequestException } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { LoginRestaurantDto } from './dto/login-restaurant.dto';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post('register')
  async create(@Body() createRestaurantDto: CreateRestaurantDto) {
    const restaurant = await this.restaurantService.create(createRestaurantDto);
    return {
      status: true,
      message: 'Đăng ký nhà hàng thành công',
      data: restaurant,
    };
  }

  @Post('login')
  async login(@Body() loginRestaurantDto: LoginRestaurantDto) {
    const restaurant = await this.restaurantService.login(loginRestaurantDto);
    return {
      status: true,
      message: 'Đăng nhập thành công',
      data: restaurant,
    };
  }

  @Get()
  async findAll() {
    const restaurants = await this.restaurantService.findAll();
    return {
      status: true,
      message: 'Lấy danh sách nhà hàng thành công',
      data: restaurants,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const restaurant = await this.restaurantService.findOne(Number(id));
    return {
      status: true,
      message: 'Lấy thông tin nhà hàng thành công',
      data: restaurant,
    };
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    const restaurant = await this.restaurantService.verifyEmail(token);
    return {
      status: true,
      message: 'Xác thực email thành công',
      data: restaurant,
    };
  }

  @Post('verify-email')
  async verifyEmailPost(@Body() body: { token?: string }) {
    if (!body?.token) {
      throw new BadRequestException('Token xác thực không được để trống');
    }
    const restaurant = await this.restaurantService.verifyEmail(body.token);
    return {
      status: true,
      message: 'Xác thực email thành công',
      data: restaurant,
    };
  }
}
