import { Module } from '@nestjs/common';
import { ElderProfileController } from './elder-profile.controller';
import { ElderProfileService } from './elder-profile.service';

@Module({
  controllers: [ElderProfileController],
  providers: [ElderProfileService],
  exports: [ElderProfileService],
})
export class ElderProfileModule {}
