import {
  Controller,
  Body,
  ParseIntPipe,
  Post,
  Query,
  Param,
} from '@nestjs/common';
import { MatchService } from './match.service';
import { UpdateMatchDto } from './dto/update-match.dto';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  // endpoint to submit a score of the player
  @Post('/:id/submit-score')
  submitScore(
    @Param('id', ParseIntPipe) matchId: number,
    @Query('playerId', ParseIntPipe) playerId: number,
    @Body() updateMatchDto: UpdateMatchDto,
  ) {
    return this.matchService.submitScore(playerId, matchId, updateMatchDto);
  }
}
