import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ElderProfileModule } from './modules/elder-profile/elder-profile.module';
import { UserModule } from './modules/user/user.module';
import { FamilyBindingModule } from './modules/family-binding/family-binding.module';
import { TaskModule } from './modules/task/task.module';
import { MetricModule } from './modules/metric/metric.module';
import { MedicationModule } from './modules/medication/medication.module';
import { ReportModule } from './modules/report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    ElderProfileModule,
    FamilyBindingModule,
    TaskModule,
    MetricModule,
    MedicationModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
