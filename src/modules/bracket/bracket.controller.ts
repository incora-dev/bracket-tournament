import { Controller, ParseIntPipe, Get, Param } from '@nestjs/common';
import { BracketService } from './bracket.service';

@Controller('brackets')
export class BracketController {
  constructor(private readonly bracketService: BracketService) {}

  // endpoint to get the status of the whole bracket tournament
  @Get('/:id/status')
  getBracketStatus(@Param('id', ParseIntPipe) id: number) {
    return this.bracketService.getBracketStatus(id);
  }
}
