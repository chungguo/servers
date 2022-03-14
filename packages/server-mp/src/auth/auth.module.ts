import { Module } from '@nestjs/common';
import { HelpersModule } from 'src/helpers/helpers.module';
import { AuthController } from 'src/auth/auth.controller';

@Module({
  imports: [HelpersModule],
  controllers: [AuthController],
})
export class AuthModule { }
