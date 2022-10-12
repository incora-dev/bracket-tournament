import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from 'src/models/match.entity';
import { MatchInfo } from 'src/models/matchInfo.entity';
import { MatchStatuses } from 'src/models/types/matchStatus.enum';
import { Repository } from 'typeorm';
import { SubmitScoreResponseDto } from './dto/submit-score-response.dto';
import { UpdateMatchDto } from './dto/update-match.dto';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @InjectRepository(MatchInfo)
    private readonly matchInfoRepository: Repository<MatchInfo>,
  ) {}

  async submitScore(
    playerId: number,
    matchId: number,
    { score }: UpdateMatchDto,
  ): Promise<SubmitScoreResponseDto> {
    // get player's match
    const match = await this.matchRepository.findOne({
      where: [
        {
          id: matchId,
          matchInfo1: { playerId: playerId },
        },
        {
          id: matchId,
          matchInfo2: { playerId: playerId },
        },
      ],
      relations: ['matchInfo1', 'matchInfo2'],
    });
    // throw error when updating someone's match
    if (!match) {
      throw new BadRequestException('Invalid Match ID');
    }

    // init current/own and another match info
    const { matchInfo1, matchInfo2, nextMatchId } = match;
    let currentPlayerMatchInfo: MatchInfo;
    let anotherPlayerMatchInfo: MatchInfo;

    if (matchInfo1.playerId === playerId) {
      currentPlayerMatchInfo = matchInfo1;
      anotherPlayerMatchInfo = matchInfo2;
    } else {
      currentPlayerMatchInfo = matchInfo2;
      anotherPlayerMatchInfo = matchInfo1;
    }
    // update score
    await this.matchInfoRepository.update(
      { id: currentPlayerMatchInfo.id },
      { score, status: MatchStatuses.FINISHED },
    );
    currentPlayerMatchInfo.score = score;
    if (anotherPlayerMatchInfo && anotherPlayerMatchInfo.score) {
      // both players have scores -> closing match with winner
      return this.handleMatchResult(
        currentPlayerMatchInfo,
        anotherPlayerMatchInfo,
        nextMatchId,
      );
    }

    return { nextMatchId: null };
  }

  async handleMatchResult(
    currentPlayerMatchInfo: MatchInfo,
    anotherPlayerMatchInfo: MatchInfo,
    nextMatchId: number,
  ) {
    // deciding winner
    const winner =
      anotherPlayerMatchInfo.score < currentPlayerMatchInfo.score
        ? currentPlayerMatchInfo
        : anotherPlayerMatchInfo;

    // create new matchInfo
    const { id: winnerMatchInfoId } = await this.matchInfoRepository.save({
      playerId: winner.playerId,
      status: MatchStatuses.PLAYING,
    });
    // get nextMatchInfo
    const { matchInfoId1: nextMatchInfo } = await this.matchRepository.findOne({
      id: nextMatchId,
    });

    // move to next round as a winner
    const keyToUpdate: keyof Match = nextMatchInfo
      ? 'matchInfoId2'
      : 'matchInfoId1';
    await this.matchRepository.update(
      { id: nextMatchId },
      { [keyToUpdate]: winnerMatchInfoId },
    );

    return {
      nextMatchId: winner === currentPlayerMatchInfo ? nextMatchId : null,
    };
  }
}
