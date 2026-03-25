import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateElderProfileDto } from './dto/create-elder-profile.dto';
import { UpdateElderProfileDto } from './dto/update-elder-profile.dto';

@Injectable()
export class ElderProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateElderProfileDto) {
    return this.prisma.elderProfile.upsert({
      where: { userId: dto.userId },
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
        userId: dto.userId,
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
    });
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
