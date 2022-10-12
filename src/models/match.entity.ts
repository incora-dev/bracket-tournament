import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Bracket } from './bracket.entity';
import { MatchInfo } from './matchInfo.entity';
import { BracketRounds } from './types/round.enum';

@Entity({ name: 'matches' })
export class Match extends BaseEntity {
  @Column()
  bracketId: number;

  @Column({ nullable: true })
  nextMatchId: number;

  @Column({ nullable: true })
  matchInfoId1: number;

  @Column({ nullable: true })
  matchInfoId2: number;

  @Column({
    type: 'enum',
    enum: BracketRounds,
  })
  round: number;

  @OneToOne(() => MatchInfo, (matchInfo) => matchInfo.match)
  @JoinColumn({ name: 'match_info_id1' })
  matchInfo1: MatchInfo;

  @OneToOne(() => MatchInfo, (matchInfo) => matchInfo.match)
  @JoinColumn({ name: 'match_info_id2' })
  matchInfo2: MatchInfo;

  @ManyToOne(() => Bracket, (bracket) => bracket.matches)
  bracket: Bracket;
}
