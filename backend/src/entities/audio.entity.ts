import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('audios')
export class Audio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fileUrl: string;

  @Column('text', { nullable: true })
  transcript: string;
}
