import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * Warehouse entity represents a physical storage location.
 * We'll use this later to link shipments to origin and destination points.
 */
@Entity()
export class Warehouse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column({ default: true })
  isActive: boolean;
}
