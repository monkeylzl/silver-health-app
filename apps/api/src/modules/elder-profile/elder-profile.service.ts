import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateElderProfileDto } from './dto/create-elder-profile.dto';
import { UpdateElderProfileDto } from './dto/update-elder-profile.dto';

@Injectable()
export class ElderProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateElderProfileDto) {
    const ensuredUserId = dto.userId?.trim()
      ? dto.userId.trim()
      : (
          await this.prisma.user.create({
            data: {
              role: UserRole.elder,
              nickname: dto.nickname?.trim() || dto.name,
              mobile: dto.mobile?.trim() || undefined,
            },
          })
        ).id;

    const profile = await this.prisma.elderProfile.upsert({
      where: { userId: ensuredUserId },
      update: {
        name: dto.name,
        gender: dto.gender,
        age: dto.age,
        heightCm: dto.heightCm,
        weightKg: dto.weightKg,
        chronicConditions: dto.chronicConditions,
        commonMedicines: dto.commonMedicines,
        mobilityLevel: dto.mobilityLevel,
        helperMode: dto.helperMode,
      },
      create: {
        userId: ensuredUserId,
        name: dto.name,
        gender: dto.gender,
        age: dto.age,
        heightCm: dto.heightCm,
        weightKg: dto.weightKg,
        chronicConditions: dto.chronicConditions,
        commonMedicines: dto.commonMedicines,
        mobilityLevel: dto.mobilityLevel,
        helperMode: dto.helperMode,
      },
      include: {
        user: true,
      },
    });

    return {
      ...profile,
      createdUser: !dto.userId,
    };
  }

  async findByUserId(userId: string) {
    const profile = await this.prisma.elderProfile.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!profile) {
      throw new NotFoundException(`elder profile not found for userId=${userId}`);
    }

    return profile;
  }

  async updateByUserId(userId: string, dto: UpdateElderProfileDto) {
    await this.findByUserId(userId);

    return this.prisma.elderProfile.update({
      where: { userId },
      data: dto,
    });
  }
}
