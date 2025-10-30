import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Driver } from '../driver/driver.entity';
import { Vehicle } from '../vehicle/vehicle.entity';
import { Warehouse } from '../warehouse/warehouse.entity';

/**
 * Shipment represents a delivery order in the system.
 * It ties together warehouses, vehicles, and drivers.
 */
@Entity()
export class Shipment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  referenceCode: string; // unique shipment reference (auto-generated later)

  @ManyToOne(() => Warehouse, { eager: true })
  origin: Warehouse;

  @ManyToOne(() => Warehouse, { eager: true })
  destination: Warehouse;

  @ManyToOne(() => Driver, { eager: true, nullable: true })
  driver: Driver;

  @ManyToOne(() => Vehicle, { eager: true, nullable: true })
  vehicle: Vehicle;

  @Column({ default: 'pending' })
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';

  @Column({ nullable: true })
  cargoDescription: string;

  @Column({ type: 'float', nullable: true })
  weight: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
