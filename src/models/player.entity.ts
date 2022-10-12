import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MatchInfo } from './matchInfo.entity';

@Entity({ name: 'players' })
export class Player extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => MatchInfo, (matchInfo) => matchInfo.player)
  matchInfos: MatchInfo[];
}
