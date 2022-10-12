import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1665611740480 implements MigrationInterface {
  name = 'init1665611740480';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "players" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_de22b8fdeee0c33ab55ae71da3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."matches_info_status_enum" AS ENUM('playing', 'waiting', 'finished')`,
    );
    await queryRunner.query(
      `CREATE TABLE "matches_info" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "player_id" integer NOT NULL, "status" "public"."matches_info_status_enum" NOT NULL DEFAULT 'waiting', "score" integer, CONSTRAINT "PK_3564540c6aa1a3227d58ae62d3d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."matches_round_enum" AS ENUM('1', '2', '3', '4')`,
    );
    await queryRunner.query(
      `CREATE TABLE "matches" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "bracket_id" integer NOT NULL, "next_match_id" integer, "match_info_id1" integer, "match_info_id2" integer, "round" "public"."matches_round_enum" NOT NULL, CONSTRAINT "REL_07b356ffa09615f38933e8e1bd" UNIQUE ("match_info_id1"), CONSTRAINT "REL_7adac032a1c926a12ab8b042a9" UNIQUE ("match_info_id2"), CONSTRAINT "PK_8a22c7b2e0828988d51256117f4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."brackets_size_enum" AS ENUM('8', '16')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."brackets_status_enum" AS ENUM('open', 'closed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "brackets" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "size" "public"."brackets_size_enum" NOT NULL DEFAULT '8', "status" "public"."brackets_status_enum" NOT NULL DEFAULT 'open', CONSTRAINT "PK_557930575b564b859ce0f0c99c5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "matches_info" ADD CONSTRAINT "FK_c64a55145e244db211a605f14d4" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "matches" ADD CONSTRAINT "FK_07b356ffa09615f38933e8e1bd4" FOREIGN KEY ("match_info_id1") REFERENCES "matches_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "matches" ADD CONSTRAINT "FK_7adac032a1c926a12ab8b042a97" FOREIGN KEY ("match_info_id2") REFERENCES "matches_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "matches" ADD CONSTRAINT "FK_42766240793d920e562a30a04f7" FOREIGN KEY ("bracket_id") REFERENCES "brackets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "matches" DROP CONSTRAINT "FK_42766240793d920e562a30a04f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matches" DROP CONSTRAINT "FK_7adac032a1c926a12ab8b042a97"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matches" DROP CONSTRAINT "FK_07b356ffa09615f38933e8e1bd4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matches_info" DROP CONSTRAINT "FK_c64a55145e244db211a605f14d4"`,
    );
    await queryRunner.query(`DROP TABLE "brackets"`);
    await queryRunner.query(`DROP TYPE "public"."brackets_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."brackets_size_enum"`);
    await queryRunner.query(`DROP TABLE "matches"`);
    await queryRunner.query(`DROP TYPE "public"."matches_round_enum"`);
    await queryRunner.query(`DROP TABLE "matches_info"`);
    await queryRunner.query(`DROP TYPE "public"."matches_info_status_enum"`);
    await queryRunner.query(`DROP TABLE "players"`);
  }
}
