import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type UserRole = 'admin' | 'driver' | 'customer';

@Entity()
export class User {
  // Auto-incrementing primary key
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // We'll add more fields later (email, role, etc.)
  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  fullName: string;

  @Column({ type: 'enum', enum: ['admin', 'driver', 'customer'], default: 'customer' })
  role: UserRole;

}
