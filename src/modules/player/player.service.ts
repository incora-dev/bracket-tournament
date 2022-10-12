import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchInfo } from 'src/models/matchInfo.entity';
import { MatchStatuses } from 'src/models/types/matchStatus.enum';
import { Repository } from 'typeorm';
import { BracketService } from '../bracket/bracket.service';
import { JoinBracketResponseDto } from './dto/join-bracket-response.dto';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(MatchInfo)
    private readonly matchInfoRepository: Repository<MatchInfo>,
    private readonly bracketsService: BracketService,
  ) {}

  async joinBracket(
    playerId: number,
    size: number,
  ): Promise<JoinBracketResponseDto> {
    const { id: matchInfoId } = await this.matchInfoRepository.save({
      playerId,
      status: MatchStatuses.PLAYING,
    });
    // get existed bracket and join
    const bracketMatch = await this.bracketsService.joinBracketMatch(
      playerId,
      matchInfoId,
      size,
    );
    // if bracket exist return it
    if (bracketMatch) {
      return bracketMatch;
    }
    // bracket doesn't exist so create new and join
    return this.bracketsService.createBracketMatchToJoin(matchInfoId, size);
  }
}
