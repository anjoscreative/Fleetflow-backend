import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;                // e.g., 'warehouse-scanner-1'

  @Column({ unique: true })
  apiKey: string;              // signed key for this device

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  registeredAt: Date;
}
