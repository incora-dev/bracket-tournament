import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Match } from './match.entity';
import { BracketSizes } from './types/size.enum';
import { BracketStatuses } from './types/bracketStatus.enum';

@Entity({ name: 'brackets' })
export class Bracket extends BaseEntity {
  @Column({
    type: 'enum',
    enum: BracketSizes,
    default: BracketSizes.EIGHT,
  })
  size: number;

  @Column({
    type: 'enum',
    enum: BracketStatuses,
    default: BracketStatuses.OPEN,
  })
  status: string;

  @OneToMany(() => Match, (match) => match.bracket)
  matches: Match[];
}
