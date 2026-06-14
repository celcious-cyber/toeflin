import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { TestPackage } from './test-package.entity';

@Entity('test_attempts')
export class TestAttempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => TestPackage)
  @JoinColumn({ name: 'packageId' })
  testPackage: TestPackage;

  @Column()
  packageId: string;

  @CreateDateColumn()
  date: Date;

  @Column()
  durationSeconds: number;

  @Column('simple-json')
  answers: any;

  @Column('simple-json', { nullable: true })
  rawScores: any;

  @Column('simple-json', { nullable: true })
  scaledScores: any;

  @Column({ nullable: true })
  totalScore: number;
}
