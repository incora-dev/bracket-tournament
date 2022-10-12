import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';

describe('PlayerController', () => {
  let controller: PlayerController;

  const mockPlayerService = {
    joinBracket: jest.fn((playerId: number, size: number) => {
      return { bracketId: 1, matchId: 1 };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [PlayerService],
    })
      .overrideProvider(PlayerService)
      .useValue(mockPlayerService)
      .compile();

    controller = module.get<PlayerController>(PlayerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be join tournament', () => {
    expect(controller.joinBracket(1, 8)).toEqual({ bracketId: 1, matchId: 1 });
    expect(mockPlayerService.joinBracket).toHaveBeenCalledWith(1, 8);
  });
});
