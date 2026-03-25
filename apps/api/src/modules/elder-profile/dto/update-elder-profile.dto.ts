import { HelperMode, MobilityLevel, Gender } from '@prisma/client';

export class UpdateElderProfileDto {
  name?: string;
  gender?: Gender;
  age?: number;
  heightCm?: number;
  weightKg?: number;
  chronicConditions?: string[];
  commonMedicines?: string[];
  mobilityLevel?: MobilityLevel;
  helperMode?: HelperMode;
}
