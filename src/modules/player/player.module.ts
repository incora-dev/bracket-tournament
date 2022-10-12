import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { Match } from 'src/models/match.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bracket } from 'src/models/bracket.entity';
import { MatchInfo } from 'src/models/matchInfo.entity';
import { BracketModule } from '../bracket/bracket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bracket, Match, MatchInfo]),
    BracketModule,
  ],
  controllers: [PlayerController],
  providers: [PlayerService],
})
export class PlayerModule {}
