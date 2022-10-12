import { Test, TestingModule } from '@nestjs/testing';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';

describe('MatchController', () => {
  let controller: MatchController;

  const mockMatchService = {
    submitScore: jest.fn((matchId, playerId, updateMatchDto) => {
      return { nextMatchId: null };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchController],
      providers: [MatchService],
    })
      .overrideProvider(MatchService)
      .useValue(mockMatchService)
      .compile();

    controller = module.get<MatchController>(MatchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be return action updates', () => {
    const dto = { score: 1 };
    expect(controller.submitScore(1, 1, dto)).toEqual({ nextMatchId: null });

    expect(mockMatchService.submitScore).toHaveBeenCalledWith(1, 1, dto);
  });
});
