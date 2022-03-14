import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServerApiVersion } from 'mongodb';
import { MongooseModule } from '@nestjs/mongoose';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { MessageModule } from 'src/message/message.module';

import { XmlMiddleware } from 'src/middlewares/xml.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({
        uri: config.get('MONGODB_URL'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: ServerApiVersion.v1,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    MessageModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(XmlMiddleware).forRoutes('*');
  }
}
