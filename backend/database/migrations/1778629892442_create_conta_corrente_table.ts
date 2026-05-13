import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'conta_corrente'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id'),
      table.integer('numero_agencia').notNullable(),
      table.integer('digito').notNullable(),
      table.integer('id_usuario').unsigned().references('id').inTable('users').notNullable(),
      table.float('saldo').notNullable(),

      table.timestamp('created_at'),
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}