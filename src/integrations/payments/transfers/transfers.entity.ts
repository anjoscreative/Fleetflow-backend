import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { VirtualAccount } from '../virtual-accounts/virtual-account.entity';

@Entity()
export class Transfer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => VirtualAccount)
  fromAccount: VirtualAccount;

  @ManyToOne(() => VirtualAccount)
  toAccount: VirtualAccount;

  @Column('float')
  amount: number;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
