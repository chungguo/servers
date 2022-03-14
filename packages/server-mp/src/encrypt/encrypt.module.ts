import { Module, Global } from '@nestjs/common';
import { EncryptService } from 'src/encrypt/encrypt.service';

@Global()
@Module({
  providers: [EncryptService],
  exports: [EncryptService],
})
export class EncryptModule { }
