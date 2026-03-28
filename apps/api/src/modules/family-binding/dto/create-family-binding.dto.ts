import { BindingRelationType } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class CreateFamilyBindingDto {
  @IsString()
  elderUserId!: string;

  @IsString()
  familyUserId!: string;

  @IsEnum(BindingRelationType)
  relationType!: BindingRelationType;
}
