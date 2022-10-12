import { Entity, Column, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Match } from './match.entity';
import { Player } from './player.entity';
import { MatchStatuses } from './types/matchStatus.enum';

@Entity({ name: 'matches_info' })
export class MatchInfo extends BaseEntity {
  @Column()
  playerId: number;

  @Column({
    type: 'enum',
    enum: MatchStatuses,
    default: MatchStatuses.WAITING,
  })
  status: string;

  @Column({ nullable: true })
  score: number;

  @OneToOne(() => Match, (match) => match.matchInfo1 || match.matchInfo2)
  match: Match;

  @ManyToOne(() => Player, (player) => player.matchInfos)
  player: Player;
}
