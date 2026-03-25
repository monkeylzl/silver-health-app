import { UserRole, UserStatus } from '@prisma/client';

export class CreateUserDto {
  role!: UserRole;
  nickname?: string;
  avatar?: string;
  mobile?: string;
  openId?: string;
  unionId?: string;
  status?: UserStatus;
}
