import { Module } from '@nestjs/common';
import { FamilyBindingController } from './family-binding.controller';
import { FamilyBindingService } from './family-binding.service';

@Module({
  controllers: [FamilyBindingController],
  providers: [FamilyBindingService],
  exports: [FamilyBindingService],
})
export class FamilyBindingModule {}
