import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Match } from 'src/models/match.entity';
import { MatchInfo } from 'src/models/matchInfo.entity';
import { MatchService } from './match.service';

describe('MatchService', () => {
  let service: MatchService;

  const mockMatchRepository = {
    findOne: jest.fn(() => {
      return {
        id: 170,
        createdAt: '2022-10-12T19:30:09.957Z',
        updatedAt: '2022-10-12T19:43:02.069Z',
        bracketId: 25,
        nextMatchId: 169,
        matchInfoId1: 68,
        matchInfoId2: 69,
        round: 2,
        matchInfo1: {
          id: 68,
          createdAt: '2022-10-12T19:34:40.409Z',
          updatedAt: '2022-10-12T19:57:52.045Z',
          playerId: 2,
          status: 'finished',
          score: 20,
        },
        matchInfo2: {
          id: 69,
          createdAt: '2022-10-12T19:43:02.056Z',
          updatedAt: '2022-10-12T19:43:02.056Z',
          playerId: 2,
          status: 'playing',
          score: null,
        },
      };
    }),
    update: jest.fn(),
  };

  const mockMatchInfoRepository = {
    save: jest.fn(() => {
      return { id: 1 };
    }),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchService,
        {
          provide: getRepositoryToken(Match),
          useValue: mockMatchRepository,
        },
        {
          provide: getRepositoryToken(MatchInfo),
          useValue: mockMatchInfoRepository,
        },
      ],
    }).compile();

    service = module.get<MatchService>(MatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be submit match score', async () => {
    const dto = { score: 1 };
    expect(await service.submitScore(1, 1, dto)).toEqual({ nextMatchId: null });
  });
});
