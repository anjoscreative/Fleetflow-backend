import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

/**
 * VirtualAccount entity stores all generated virtual accounts.
 * These accounts are linked to customers or shipments.
 */
@Entity()
export class VirtualAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  provider: string; // e.g., 'paystack' or 'flutterwave'

  @Column()
  accountNumber: string;

  @Column()
  bankName: string;

  @Column()
  customerName: string;

  @Column({ nullable: true })
  reference?: string; // API reference from the provider

  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'float', default: 0 })
  balance: number;
}
