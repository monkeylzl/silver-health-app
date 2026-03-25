import { Injectable } from '@nestjs/common';
import { BindingStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFamilyBindingDto } from './dto/create-family-binding.dto';

@Injectable()
export class FamilyBindingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFamilyBindingDto) {
    return this.prisma.familyBinding.create({
      data: {
        elderUserId: dto.elderUserId,
        familyUserId: dto.familyUserId,
        relationType: dto.relationType,
        status: BindingStatus.pending,
      },
    });
  }

  async findByElderUserId(elderUserId: string) {
    return this.prisma.familyBinding.findMany({
      where: { elderUserId },
      include: {
        familyUser: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
