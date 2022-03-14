import { Module, Global } from '@nestjs/common';
import { HelpersService } from 'src/helpers/helpers.service';

@Global()
@Module({
  providers: [HelpersService],
  exports: [HelpersService],
})
export class HelpersModule { }
