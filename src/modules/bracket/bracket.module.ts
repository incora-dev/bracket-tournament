import { Module } from '@nestjs/common';
import { BracketService } from './bracket.service';
import { BracketController } from './bracket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bracket } from 'src/models/bracket.entity';
import { Match } from 'src/models/match.entity';
import { MatchInfo } from 'src/models/matchInfo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bracket, Match, MatchInfo])],
  controllers: [BracketController],
  providers: [BracketService],
  exports: [BracketService],
})
export class BracketModule {}
