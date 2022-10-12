import {
  Controller,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { BracketSizes } from 'src/models/types/size.enum';
import { PlayerService } from './player.service';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  // endpoint for a player to join a bracket
  @Post('/:id/join-tournament')
  joinBracket(
    @Param('id', ParseIntPipe) playerId: number,
    @Query('size', new ParseEnumPipe(BracketSizes)) size: BracketSizes,
  ) {
    return this.playerService.joinBracket(playerId, size);
  }
}
