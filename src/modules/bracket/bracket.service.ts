import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bracket } from 'src/models/bracket.entity';
import { Match } from 'src/models/match.entity';
import { MatchInfo } from 'src/models/matchInfo.entity';
import { BracketStatuses } from 'src/models/types/bracketStatus.enum';
import { BracketRounds } from 'src/models/types/round.enum';
import { Brackets, In, Not, Repository } from 'typeorm';
import { JoinBracketResponseDto } from '../player/dto/join-bracket-response.dto';
import { GetBracketStatusResponseDto } from './dto/get-bracket-status-response.dto';

@Injectable()
export class BracketService {
  constructor(
    @InjectRepository(Bracket)
    private readonly bracketRepository: Repository<Bracket>,
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @InjectRepository(MatchInfo)
    private readonly matchInfoRepository: Repository<MatchInfo>,
  ) {}
  // method to get bracket status of the whole tournament
  async getBracketStatus(id: number): Promise<GetBracketStatusResponseDto> {
    // get bracket and all matches
    const bracket = await this.bracketRepository.findOne({ id });
    const matches = await this.matchRepository.find({
      where: { bracketId: id },
      relations: ['matchInfo1', 'matchInfo2'],
    });
    // generate matchView -> object where keys are Rounds and values are arrays of Matches with info
    const matchesView = matches.reduce((acc, match) => {
      const { id, round, matchInfo1, matchInfo2, nextMatchId } = match;
      const roundInfo = acc[round] || [];

      roundInfo.push({ id, matchInfo1, matchInfo2, nextMatchId });

      return { ...acc, [round]: roundInfo };
    }, {});

    return { bracket, matchesView };
  }

  async createBracketMatchToJoin(
    matchInfoId: number,
    size: number,
  ): Promise<JoinBracketResponseDto> {
    const { id: bracketId } = await this.bracketRepository.save({ size });
    const roundCount = Math.log2(size);
    // generate all matches for bracket
    await this.generateBracketMatches(roundCount, bracketId);
    // get match to join and join it
    const matchToJoin = await this.matchRepository.findOne({
      bracketId,
      round: BracketRounds.FIRST,
    });
    const { id: matchId } = matchToJoin;

    await this.matchRepository.update(
      { id: matchId },
      { matchInfoId1: matchInfoId },
    );

    return {
      bracketId,
      matchId,
    };
  }

  async joinBracketMatch(
    playerId: number,
    matchInfoId: number,
    size: number,
  ): Promise<JoinBracketResponseDto | null> {
    // get player's brackets
    const joinedMatches: Partial<Match>[] = await this.matchInfoRepository
      .createQueryBuilder('matches_info')
      .distinctOn(['m.bracket_id'])
      .select(['m.bracket_id AS "bracketId"'])
      .innerJoin(
        'matches',
        'm',
        'm.match_info_id1 = matches_info.id OR m.match_info_id2 = matches_info.id',
      )
      .where({ playerId })
      .getRawMany();
    // get brackets to join
    // avoiding same game - same player, same game - same match issues
    const bracketToJoin = await this.bracketRepository.findOne({
      where: {
        size,
        status: BracketStatuses.OPEN,
        id: Not(In(joinedMatches.map(({ bracketId }) => bracketId))),
      },
    });
    // if there isn't bracket -> will return null and move to createBracketMatchToJoin function
    if (!bracketToJoin) return null;

    const { id: bracketId } = bracketToJoin;

    // get all available matches
    const matchesToJoin = await this.matchRepository
      .createQueryBuilder('match')
      .where(
        new Brackets((qb) => {
          qb.where({ matchInfoId1: null }).orWhere({ matchInfoId2: null });
        }),
      )
      .andWhere({ bracketId, round: BracketRounds.FIRST })
      .getMany();

    // join available match
    const [matchToJoin] = matchesToJoin;
    const { id: matchId, matchInfoId1 } = matchToJoin;
    const keyToUpdate: keyof Match = matchInfoId1
      ? 'matchInfoId2'
      : 'matchInfoId1';
    await this.matchRepository.update(
      { id: matchId },
      { [keyToUpdate]: matchInfoId },
    );

    // update bracket status
    await this.updateBracketStatus(bracketId, matchesToJoin);

    return { bracketId, matchId };
  }

  private async updateBracketStatus(bracketId: number, matches: Match[]) {
    const bracketStatus = this.handleBracketStatus(matches);

    // update to closed status
    if (bracketStatus === BracketStatuses.CLOSED) {
      await this.bracketRepository.update(
        { id: bracketId },
        { status: bracketStatus },
      );
    }
  }

  // get current status
  private handleBracketStatus(matches: Match[]) {
    // change here
    const [matchToJoin] = matches;

    if (matches.length > 1) {
      return BracketStatuses.OPEN;
    }

    if (!matchToJoin.matchInfo1 && !matchToJoin.matchInfo1) {
      return BracketStatuses.OPEN;
    }

    return BracketStatuses.CLOSED;
  }

  // method to generate all matches for bracket
  private async generateBracketMatches(
    round: BracketRounds,
    bracketId: number,
    nextMatchId: number | null = null,
  ) {
    const match = await this.matchRepository.save({
      bracketId,
      round,
      nextMatchId,
    });

    if (round > 1) {
      await this.generateBracketMatches(round - 1, bracketId, match.id);
      await this.generateBracketMatches(round - 1, bracketId, match.id);
    }
  }
}
