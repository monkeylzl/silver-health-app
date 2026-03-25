import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        role: dto.role,
        nickname: dto.nickname,
        avatar: dto.avatar,
        mobile: dto.mobile,
        openId: dto.openId,
        unionId: dto.unionId,
        status: dto.status,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        elderProfile: true,
      },
    });
  }
}
