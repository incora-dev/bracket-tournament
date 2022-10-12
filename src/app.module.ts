import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService, registerAs } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BracketModule } from './modules/bracket/bracket.module';
import { MatchModule } from './modules/match/match.module';
import { PlayerModule } from './modules/player/player.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [registerAs('typeorm', () => require('../ormconfig'))],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...(configService.get('typeorm')[0] as TypeOrmModuleOptions),
      }),
    }),
    MatchModule,
    BracketModule,
    PlayerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
