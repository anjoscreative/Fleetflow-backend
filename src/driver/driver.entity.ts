import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../entities/user.entity';
import { Vehicle } from 'src/vehicle/vehicle.entity';

/**
 * Driver entity extends the base user with logistics-related info.
 */
@Entity()
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  licenseNumber: string;

  @Column({ default: 'available' })
  status: 'available' | 'on_trip' | 'offline';

  @OneToOne(() => Vehicle, (vehicle) => vehicle.assignedDriver, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  assignedVehicle?: Vehicle | null;
}
