import { BindingRelationType } from '@prisma/client';

export class CreateFamilyBindingDto {
  elderUserId!: string;
  familyUserId!: string;
  relationType!: BindingRelationType;
}
