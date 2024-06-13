// Core
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService, ConfigModule } from '@nestjs/config';

// Tools
import { ENV } from '../utils';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get(ENV[ENV.DB_LINK]),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DbModule {}
