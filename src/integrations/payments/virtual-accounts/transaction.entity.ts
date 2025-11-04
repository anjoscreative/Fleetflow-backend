import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { VirtualAccount } from './virtual-account.entity';

/**
 * Transaction entity represents incoming payments for a virtual account.
 * Each deposit webhook creates a record here.
 */
@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => VirtualAccount, { eager: true })
  account: VirtualAccount;

  @Column()
  amount: number;

  @Column()
  currency: string;

  @Column()
  reference: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'successful' | 'failed';

  @CreateDateColumn()
  createdAt: Date;
}
