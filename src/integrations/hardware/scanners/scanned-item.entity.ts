import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class ScannedItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column({ nullable: true })
  type: string; // e.g., 'barcode' or 'qr'

  @Column({ nullable: true })
  sourceDevice: string; // e.g., 'warehouse-scanner-1'

  @CreateDateColumn()
  scannedAt: Date;
}
