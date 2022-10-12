import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlayerService } from './player.service';
import { MatchInfo } from 'src/models/matchInfo.entity';

describe('PlayerService', () => {
  let service: PlayerService;

  const mockMatchInfoRepository = {
    save: jest.fn(() => {
      return { id: 1 };
    }),
  };

  const mockPlayerService = {
    joinBracket: jest.fn((playerId, size) => {
      return { bracketId: 1, matchId: 1 };
    }),
    joinBracketMatch: jest.fn((playerId, matchInfoId, size) => {
      return { bracketId: 1, matchId: 1 };
    }),
    createBracketMatchToJoin: jest.fn((matchInfoId, size) => {
      return {
        bracketId: 1,
        matchId: 1,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        {
          provide: getRepositoryToken(MatchInfo),
          useValue: mockMatchInfoRepository,
        },
      ],
    })
      .overrideProvider(PlayerService)
      .useValue(mockPlayerService)
      .compile();

    service = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be join bracket', () => {
    expect(service.joinBracket(1, 8)).toEqual({
      bracketId: 1,
      matchId: 1,
    });

    expect(mockPlayerService.joinBracket).toHaveBeenCalledWith(1, 8);
  });
});
