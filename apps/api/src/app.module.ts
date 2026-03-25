import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ElderProfileModule } from './modules/elder-profile/elder-profile.module';
import { UserModule } from './modules/user/user.module';
import { FamilyBindingModule } from './modules/family-binding/family-binding.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    ElderProfileModule,
    FamilyBindingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
