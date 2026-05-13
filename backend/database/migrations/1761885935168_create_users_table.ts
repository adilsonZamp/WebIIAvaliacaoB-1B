import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('nome').notNullable()
      table.string('cpf').notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.string('tipo').notNullable
      table.string('cidade').nullable
      table.string('estado').nullable
      table.string('rua').nullable
      table.string('numero').nullable

      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
