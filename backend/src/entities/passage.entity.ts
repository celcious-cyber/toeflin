import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('passages')
export class Passage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;
}
