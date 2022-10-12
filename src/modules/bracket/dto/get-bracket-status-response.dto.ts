import { Bracket } from 'src/models/bracket.entity';

export class GetBracketStatusResponseDto {
  bracket: Bracket;
  matchesView: any;
}
