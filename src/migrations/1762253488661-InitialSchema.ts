import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1762253488661 implements MigrationInterface {
    name = 'InitialSchema1762253488661'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "virtual_account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "provider" character varying NOT NULL, "accountNumber" character varying NOT NULL, "bankName" character varying NOT NULL, "customerName" character varying NOT NULL, "reference" character varying, "isActive" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_99fe832b729025bba1ec2431d56" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "virtual_account"`);
    }

}
