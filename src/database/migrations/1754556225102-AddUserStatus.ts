import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserStatus1754556225102 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE users 
            ADD COLUMN status ENUM('inactive', 'active', 'blocked') 
            NOT NULL DEFAULT 'inactive'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE users 
            DROP COLUMN status
        `);
    }

}
