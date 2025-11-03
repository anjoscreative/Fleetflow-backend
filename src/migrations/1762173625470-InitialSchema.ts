import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1762173625470 implements MigrationInterface {
    name = 'InitialSchema1762173625470'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "warehouse" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "location" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_965abf9f99ae8c5983ae74ebde8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'driver', 'customer')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "fullName" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'customer', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vehicle" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "plateNumber" character varying NOT NULL, "model" character varying NOT NULL, "capacityKg" integer NOT NULL, "isAvailable" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_187fa17ba39d367e5604b3d1ec9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "driver" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "phone" character varying, "licenseNumber" character varying, "status" character varying NOT NULL DEFAULT 'available', "userId" uuid, "assignedVehicleId" uuid, CONSTRAINT "REL_abf4fe92b1ed7d4ffa2d4e8045" UNIQUE ("userId"), CONSTRAINT "REL_60a46e09d42a4f74e69701c851" UNIQUE ("assignedVehicleId"), CONSTRAINT "PK_61de71a8d217d585ecd5ee3d065" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "shipment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "referenceCode" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "cargoDescription" character varying, "weight" double precision, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "originId" uuid, "destinationId" uuid, "driverId" uuid, "vehicleId" uuid, CONSTRAINT "PK_f51f635db95c534ca206bf7a0a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "driver" ADD CONSTRAINT "FK_abf4fe92b1ed7d4ffa2d4e8045a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "driver" ADD CONSTRAINT "FK_60a46e09d42a4f74e69701c8518" FOREIGN KEY ("assignedVehicleId") REFERENCES "vehicle"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD CONSTRAINT "FK_e3aed6aecc6235b904bc32e4557" FOREIGN KEY ("originId") REFERENCES "warehouse"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD CONSTRAINT "FK_8040dfce5c62f00734044f589d7" FOREIGN KEY ("destinationId") REFERENCES "warehouse"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD CONSTRAINT "FK_53bbae5c81a289929701777217e" FOREIGN KEY ("driverId") REFERENCES "driver"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD CONSTRAINT "FK_e0a8583167d11cdfd5352b7a4c0" FOREIGN KEY ("vehicleId") REFERENCES "vehicle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipment" DROP CONSTRAINT "FK_e0a8583167d11cdfd5352b7a4c0"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP CONSTRAINT "FK_53bbae5c81a289929701777217e"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP CONSTRAINT "FK_8040dfce5c62f00734044f589d7"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP CONSTRAINT "FK_e3aed6aecc6235b904bc32e4557"`);
        await queryRunner.query(`ALTER TABLE "driver" DROP CONSTRAINT "FK_60a46e09d42a4f74e69701c8518"`);
        await queryRunner.query(`ALTER TABLE "driver" DROP CONSTRAINT "FK_abf4fe92b1ed7d4ffa2d4e8045a"`);
        await queryRunner.query(`DROP TABLE "shipment"`);
        await queryRunner.query(`DROP TABLE "driver"`);
        await queryRunner.query(`DROP TABLE "vehicle"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "warehouse"`);
    }

}
