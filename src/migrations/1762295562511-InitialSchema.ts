import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1762295562511 implements MigrationInterface {
    name = 'InitialSchema1762295562511'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "virtual_account" ADD "balance" double precision NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "virtual_account" DROP COLUMN "balance"`);
    }

}
