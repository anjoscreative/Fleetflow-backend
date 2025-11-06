import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1762341425142 implements MigrationInterface {
    name = 'InitialSchema1762341425142'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "scanned_item" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "type" character varying, "sourceDevice" character varying, "scannedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2315f1d0e16553f004eecebc9f1" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "scanned_item"`);
    }

}
