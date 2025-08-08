import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entities/teacher.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { LoginTeacherDto } from './dto/login-teacher.dto';
import { EmailService } from '../email/email.service';
import { v4 as uuidv4 } from 'uuid';
import { TeacherStatus } from './enums/status.enum';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    private readonly emailService: EmailService,
  ) {}

  async create(dto: CreateTeacherDto): Promise<Teacher> {
    const existed = await this.teacherRepository.findOne({ where: { email: dto.email } });
    if (existed) {
      throw new BadRequestException('Email đã tồn tại');
    }
    const teacher = this.teacherRepository.create({
      ...dto,
      status: TeacherStatus.INACTIVE,
      email_verified: false,
      verify_token: uuidv4(),
    });
    const savedTeacher = await this.teacherRepository.save(teacher);
    await this.emailService.sendVerificationEmail(
      savedTeacher.email,
      savedTeacher.verify_token,
      savedTeacher.ho_ten,
      'teacher',
    );
    return savedTeacher;
  }

  async verifyEmail(token: string): Promise<Teacher> {
    const teacher = await this.teacherRepository.findOne({ where: { verify_token: token } });
    if (!teacher) throw new NotFoundException('Token xác thực không hợp lệ');
    teacher.status = TeacherStatus.ACTIVE;
    teacher.email_verified = true;
    teacher.verify_token = '';
    await this.teacherRepository.save(teacher);
    await this.emailService.sendWelcomeEmail(teacher.email, teacher.ho_ten, 'teacher');
    return teacher;
  }

  async login(dto: LoginTeacherDto): Promise<Teacher> {
    const teacher = await this.teacherRepository.findOne({
      where: { email: dto.email }
    });

    if (!teacher) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }

    // Note: In production, you should use bcrypt to compare hashed passwords
    if (teacher.mat_khau !== dto.mat_khau) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }

    if (teacher.status === TeacherStatus.BLOCKED) {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }

    if (!teacher.email_verified || teacher.status !== TeacherStatus.ACTIVE) {
      throw new UnauthorizedException('Vui lòng xác thực email trước khi đăng nhập');
    }

    return teacher;
  }

  async findAll(): Promise<Teacher[]> {
    return this.teacherRepository.find();
  }

  async findOne(id: number): Promise<Teacher> {
    const teacher = await this.teacherRepository.findOne({ where: { id } });
    if (!teacher) {
      throw new NotFoundException('Không tìm thấy giáo viên');
    }
    return teacher;
  }
}
