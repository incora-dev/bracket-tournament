import { IsNumber } from 'class-validator';

export class UpdateMatchDto {
  @IsNumber()
  score: number;
}
