import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Driver } from 'src/driver/driver.entity';

/**
 * Vehicle represents a transport asset owned by the logistics company.
 * Each vehicle can optionally be assigned to one driver at a time.
 */
@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  plateNumber: string;

  @Column()
  model: string;

  @Column()
  capacityKg: number;

  // @ManyToOne(() => Driver, { nullable: true })
  // assignedDriver?: Driver | null;

  @Column({ default: true })
  isAvailable: boolean;

  @OneToOne(() => Driver, (driver) => driver.assignedVehicle, {
    nullable: true,
  })
  assignedDriver?: Driver | null;
}
