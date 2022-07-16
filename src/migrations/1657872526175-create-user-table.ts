import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUserTable1657872526175 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "user" (
            "id" INT NOT NULL AUTO_INCREMENT,
            "firstName" varchar(255) NOT NULL,
            "lastName" varchar(255) NOT NULL,
            "email" varchar(255) NOT NULL,
            "password" varchar(255) NOT NULL,
            "phone" varchar(255) NOT NULL,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "UQ_user_email" UNIQUE ("email"),
            CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
          )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
