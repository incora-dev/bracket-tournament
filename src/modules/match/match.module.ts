import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from 'src/models/match.entity';
import { MatchInfo } from 'src/models/matchInfo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Match, MatchInfo])],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}
