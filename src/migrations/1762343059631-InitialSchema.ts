import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1762343059631 implements MigrationInterface {
    name = 'InitialSchema1762343059631'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "face_profile" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "imageUrl" character varying, "encodingHash" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2bbc8a1e65b15542c3d038087ec" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "face_profile"`);
    }

}
