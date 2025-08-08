import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { LoginRestaurantDto } from './dto/login-restaurant.dto';
import { EmailService } from '../email/email.service';
import { v4 as uuidv4 } from 'uuid';
import { RestaurantStatus } from './enums/status.enum';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    private readonly emailService: EmailService,
  ) {}

  async create(dto: CreateRestaurantDto): Promise<Restaurant> {
    const restaurant = this.restaurantRepository.create({
      ...dto,
      status: RestaurantStatus.INACTIVE,
      email_verified: false,
      verify_token: uuidv4(),
    });
    const savedRestaurant = await this.restaurantRepository.save(restaurant);
    await this.emailService.sendVerificationEmail(
      savedRestaurant.email,
      savedRestaurant.verify_token,
      savedRestaurant.ten_nha_hang,
      'restaurant',
    );
    return savedRestaurant;
  }

  async verifyEmail(token: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({ where: { verify_token: token } });
    if (!restaurant) throw new NotFoundException('Token xác thực không hợp lệ');
    restaurant.status = RestaurantStatus.ACTIVE;
    restaurant.email_verified = true;
    restaurant.verify_token = "";
    await this.restaurantRepository.save(restaurant);
    await this.emailService.sendWelcomeEmail(restaurant.email, restaurant.ten_nha_hang, 'restaurant');
    return restaurant;
  }

  async login(dto: LoginRestaurantDto): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { email: dto.email }
    });

    if (!restaurant) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }

    // Note: In production, you should use bcrypt to compare hashed passwords
    if (restaurant.mat_khau !== dto.mat_khau) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }

    if (restaurant.status === RestaurantStatus.BLOCKED) {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }

    if (!restaurant.email_verified || restaurant.status !== RestaurantStatus.ACTIVE) {
      throw new UnauthorizedException('Vui lòng xác thực email trước khi đăng nhập');
    }

    return restaurant;
  }

  async findAll(): Promise<Restaurant[]> {
    return this.restaurantRepository.find();
  }

  async findOne(id: number): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({ where: { id } });
    if (!restaurant) {
      throw new NotFoundException('Không tìm thấy nhà hàng');
    }
    return restaurant;
  }
}
