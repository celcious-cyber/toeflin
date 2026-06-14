import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('score_conversions')
export class ScoreConversion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  section: string; // 'Listening', 'Structure', 'Reading'

  @Column()
  rawScore: number;

  @Column()
  scaledScore: number;
}
