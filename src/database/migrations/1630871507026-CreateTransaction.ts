import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateTransaction1630871507026 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(new Table({
        name: 'transactions',
        columns: [
          {name: 'id', type: 'uuid', isPrimary: true},
          {name: 'type', type: 'enum', enum: ['income', 'outcome']},
          {name: 'user_id', type: 'uuid'},
          {name: 'recipient_id', type: 'uuid'},
          {name: 'amount', type: 'decimal'},
          {name: 'description', type: 'varchar'},
          {name: 'created_at', type: 'timestamp', default: 'now()'},
        ],
        foreignKeys: [
          {
            name: 'FK_transaction_user',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
          },
          {
            name: 'FK_transaction_recipient_id',
            columnNames: ['recipient_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
          }
        ]
      }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('transactions')
    }

}
