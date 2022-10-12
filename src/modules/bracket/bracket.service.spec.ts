import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Match } from 'src/models/match.entity';
import { Bracket } from 'src/models/bracket.entity';
import { MatchInfo } from 'src/models/matchInfo.entity';
import { BracketService } from './bracket.service';

describe('BracketService', () => {
  let service: BracketService;

  const mockBracketService = {
    getBracketStatus: jest.fn((id: number) => {
      return {
        bracket: {
          id: 25,
          createdAt: '2022-10-12T19:30:09.949Z',
          updatedAt: '2022-10-12T19:30:09.949Z',
          size: 8,
          status: 'open',
        },
        matchesView: {
          '1': [
            { id: 171, matchInfo1: null, matchInfo2: null, nextMatchId: 170 },
            {
              id: 172,
              matchInfo1: [[{ playerId: 1, status: 'opened', score: 1 }]],
              matchInfo2: [[{ playerId: 2, status: 'opened', score: 2 }]],
              nextMatchId: 170,
            },
            { id: 174, matchInfo1: null, matchInfo2: null, nextMatchId: 173 },
            { id: 175, matchInfo1: null, matchInfo2: null, nextMatchId: 173 },
          ],
          '2': [
            {
              id: 170,
              matchInfo1: [{ playerId: 1, status: 'opened', score: 1 }],
              matchInfo2: [[{ playerId: 2, status: 'opened', score: 2 }]],
              nextMatchId: 169,
            },
            { id: 173, matchInfo1: null, matchInfo2: null, nextMatchId: 169 },
          ],
          '3': [{ id: 169, matchInfo1: 1, matchInfo2: 1, nextMatchId: 1 }],
        },
      };
    }),
  };

  const mockMatchRepository = {
    find: jest.fn().mockImplementation(() => {
      return [
        [
          {
            id: 171,
            createdAt: '2022-10-12T19:30:09.962Z',
            updatedAt: '2022-10-12T19:30:09.982Z',
            bracketId: 25,
            nextMatchId: 170,
            matchInfoId1: null,
            matchInfoId2: null,
            round: 1,
            matchInfo1: null,
            matchInfo2: null,
          },
          {
            id: 172,
            createdAt: '2022-10-12T19:30:09.964Z',
            updatedAt: '2022-10-12T19:30:19.169Z',
            bracketId: 25,
            nextMatchId: 170,
            matchInfoId1: 67,
            matchInfoId2: 66,
            round: 1,
            matchInfo1: {
              id: 67,
              createdAt: '2022-10-12T19:30:19.157Z',
              updatedAt: '2022-10-12T19:33:20.223Z',
              playerId: 1,
              status: 'playing',
              score: 15,
            },
            matchInfo2: {
              id: 66,
              createdAt: '2022-10-12T19:30:09.914Z',
              updatedAt: '2022-10-12T19:43:02.020Z',
              playerId: 2,
              status: 'finished',
              score: 20,
            },
          },
          {
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
              updatedAt: '2022-10-12T19:43:17.161Z',
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
          },
          {
            id: 169,
            createdAt: '2022-10-12T19:30:09.953Z',
            updatedAt: '2022-10-12T19:30:09.953Z',
            bracketId: 25,
            nextMatchId: null,
            matchInfoId1: null,
            matchInfoId2: null,
            round: 3,
            matchInfo1: null,
            matchInfo2: null,
          },
          {
            id: 173,
            createdAt: '2022-10-12T19:30:09.967Z',
            updatedAt: '2022-10-12T19:30:09.967Z',
            bracketId: 25,
            nextMatchId: 169,
            matchInfoId1: null,
            matchInfoId2: null,
            round: 2,
            matchInfo1: null,
            matchInfo2: null,
          },
          {
            id: 174,
            createdAt: '2022-10-12T19:30:09.970Z',
            updatedAt: '2022-10-12T19:30:09.970Z',
            bracketId: 25,
            nextMatchId: 173,
            matchInfoId1: null,
            matchInfoId2: null,
            round: 1,
            matchInfo1: null,
            matchInfo2: null,
          },
          {
            id: 175,
            createdAt: '2022-10-12T19:30:09.974Z',
            updatedAt: '2022-10-12T19:30:09.974Z',
            bracketId: 25,
            nextMatchId: 173,
            matchInfoId1: null,
            matchInfoId2: null,
            round: 1,
            matchInfo1: null,
            matchInfo2: null,
          },
        ],
      ];
    }),
    findOne: jest.fn().mockImplementation(() => {
      return {
        id: 25,
        createdAt: '2022-10-12T19:30:09.949Z',
        updatedAt: '2022-10-12T19:30:09.949Z',
        size: 8,
        status: 'open',
      };
    }),
    update: jest.fn(),
    save: jest.fn().mockImplementation(() => {
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
  };

  const mockBracketRepository = {
    save: jest.fn().mockImplementation((size) => {
      return 1;
    }),
    findOne: jest.fn().mockImplementation((id) => {
      return {
        id: 25,
        createdAt: '2022-10-12T19:30:09.949Z',
        updatedAt: '2022-10-12T19:30:09.949Z',
        size: 8,
        status: 'open',
      };
    }),
    update: jest.fn(),
  };

  const mockMatchInfoRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BracketService,
        {
          provide: getRepositoryToken(Bracket),
          useValue: mockBracketRepository,
        },
        {
          provide: getRepositoryToken(Match),
          useValue: mockMatchRepository,
        },
        {
          provide: getRepositoryToken(MatchInfo),
          useValue: mockMatchInfoRepository,
        },
      ],
    })
      .overrideProvider(BracketService)
      .useValue(mockBracketService)
      .compile();

    service = module.get<BracketService>(BracketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be get bracket status', () => {
    expect(mockBracketService.getBracketStatus(1)).toEqual({
      bracket: {
        id: 25,
        createdAt: '2022-10-12T19:30:09.949Z',
        updatedAt: '2022-10-12T19:30:09.949Z',
        size: 8,
        status: 'open',
      },
      matchesView: {
        '1': [
          { id: 171, matchInfo1: null, matchInfo2: null, nextMatchId: 170 },
          {
            id: 172,
            matchInfo1: [[{ playerId: 1, status: 'opened', score: 1 }]],
            matchInfo2: [[{ playerId: 2, status: 'opened', score: 2 }]],
            nextMatchId: 170,
          },
          { id: 174, matchInfo1: null, matchInfo2: null, nextMatchId: 173 },
          { id: 175, matchInfo1: null, matchInfo2: null, nextMatchId: 173 },
        ],
        '2': [
          {
            id: 170,
            matchInfo1: [{ playerId: 1, status: 'opened', score: 1 }],
            matchInfo2: [[{ playerId: 2, status: 'opened', score: 2 }]],
            nextMatchId: 169,
          },
          { id: 173, matchInfo1: null, matchInfo2: null, nextMatchId: 169 },
        ],
        '3': [{ id: 169, matchInfo1: 1, matchInfo2: 1, nextMatchId: 1 }],
      },
    });
  });
});
