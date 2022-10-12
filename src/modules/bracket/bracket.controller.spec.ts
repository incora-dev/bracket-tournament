import { Test, TestingModule } from '@nestjs/testing';
import { MatchInfo } from 'src/models/matchInfo.entity';
import { BracketController } from './bracket.controller';
import { BracketService } from './bracket.service';

describe('BracketController', () => {
  let controller: BracketController;

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
              matchInfo1: [MatchInfo],
              matchInfo2: [MatchInfo],
              nextMatchId: 170,
            },
            { id: 174, matchInfo1: null, matchInfo2: null, nextMatchId: 173 },
            { id: 175, matchInfo1: null, matchInfo2: null, nextMatchId: 173 },
          ],
          '2': [
            {
              id: 170,
              matchInfo1: [MatchInfo],
              matchInfo2: [MatchInfo],
              nextMatchId: 169,
            },
            { id: 173, matchInfo1: null, matchInfo2: null, nextMatchId: 169 },
          ],
          '3': [
            { id: 169, matchInfo1: null, matchInfo2: null, nextMatchId: null },
          ],
        },
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BracketController],
      providers: [BracketService],
    })
      .overrideProvider(BracketService)
      .useValue(mockBracketService)
      .compile();

    controller = module.get<BracketController>(BracketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be get bracket status', () => {
    expect(controller.getBracketStatus(1)).toEqual({
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
            matchInfo1: [MatchInfo],
            matchInfo2: [MatchInfo],
            nextMatchId: 170,
          },
          { id: 174, matchInfo1: null, matchInfo2: null, nextMatchId: 173 },
          { id: 175, matchInfo1: null, matchInfo2: null, nextMatchId: 173 },
        ],
        '2': [
          {
            id: 170,
            matchInfo1: [MatchInfo],
            matchInfo2: [MatchInfo],
            nextMatchId: 169,
          },
          { id: 173, matchInfo1: null, matchInfo2: null, nextMatchId: 169 },
        ],
        '3': [
          { id: 169, matchInfo1: null, matchInfo2: null, nextMatchId: null },
        ],
      },
    });

    expect(mockBracketService.getBracketStatus).toHaveBeenCalledWith(1);
  });
});
