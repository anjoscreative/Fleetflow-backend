import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1762413791970 implements MigrationInterface {
    name = 'InitialSchema1762413791970'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "device" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "apiKey" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, "registeredAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_95a7af2cbe34bdf4b4a32e16876" UNIQUE ("apiKey"), CONSTRAINT "PK_2dc10972aa4e27c01378dad2c72" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "device"`);
    }

}
