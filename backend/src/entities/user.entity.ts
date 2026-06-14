import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'varchar', default: UserRole.STUDENT })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
