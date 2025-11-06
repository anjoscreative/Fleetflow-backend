import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1762324773735 implements MigrationInterface {
    name = 'InitialSchema1762324773735'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transfer" ("id" SERIAL NOT NULL, "amount" double precision NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "fromAccountId" uuid, "toAccountId" uuid, CONSTRAINT "PK_fd9ddbdd49a17afcbe014401295" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transfer" ADD CONSTRAINT "FK_7d3ca1ab6ce08f0b2245c58bd42" FOREIGN KEY ("fromAccountId") REFERENCES "virtual_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transfer" ADD CONSTRAINT "FK_6c99290e205ea60fa20ec1eeaee" FOREIGN KEY ("toAccountId") REFERENCES "virtual_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transfer" DROP CONSTRAINT "FK_6c99290e205ea60fa20ec1eeaee"`);
        await queryRunner.query(`ALTER TABLE "transfer" DROP CONSTRAINT "FK_7d3ca1ab6ce08f0b2245c58bd42"`);
        await queryRunner.query(`DROP TABLE "transfer"`);
    }

}
