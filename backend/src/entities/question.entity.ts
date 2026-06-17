import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Passage } from './passage.entity';
import { Audio } from './audio.entity';
import { TestPackage } from './test-package.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  section: string; // 'Listening', 'Structure', 'Reading'

  @Column({ nullable: true })
  skillCategory: string; // e.g., 'Part A', 'Main Idea'

  @Column('text')
  content: string;

  @Column('simple-json')
  choices: any; // e.g. { a: "...", b: "...", c: "...", d: "..." }

  @Column()
  answerKey: string; // 'A', 'B', 'C', 'D'

  @Column('text', { nullable: true })
  explanation: string;

  @ManyToOne(() => Audio, { nullable: true })
  @JoinColumn({ name: 'audioId' })
  audio: Audio;

  @Column({ nullable: true })
  audioId: string;

  @ManyToOne(() => Passage, { nullable: true })
  @JoinColumn({ name: 'passageId' })
  passage: Passage;

  @Column({ nullable: true })
  passageId: string;

  @ManyToOne(() => TestPackage, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'packageId' })
  package: TestPackage;

  @Column({ nullable: true })
  packageId: string;
}
