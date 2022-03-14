import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HelpersService } from 'src/helpers/helpers.service';
import { ReplySchema, Reply } from 'src/strategies/schemas/reply.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Reply.name,
        schema: ReplySchema,
      }
    ]),
  ],
  providers: [HelpersService],
  exports: [HelpersService],
})
export class HelpersModule { }
