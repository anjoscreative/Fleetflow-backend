import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1762250237242 implements MigrationInterface {
    name = 'InitialSchema1762250237242'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipment" ADD "expectedDeliveryAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "deliveredAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "deliveredAt"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "expectedDeliveryAt"`);
    }

}
