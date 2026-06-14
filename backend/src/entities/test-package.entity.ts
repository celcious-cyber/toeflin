import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('test_packages')
export class TestPackage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: string; // 'Full Test' or 'Latihan'

  @Column('simple-json')
  questions: any; // array of question IDs per section

  @Column('simple-json')
  durations: any; // durations per section in seconds

  @Column({ default: 'draft' })
  status: string; // 'draft' or 'published'
}
