import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
	protected tableName = 'transacao'

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id'),
			table.float('valor').notNullable(),
			table.dateTime('data').notNullable(),
			table.string('tipo').notNullable(),
			table.integer('id_conta_origem').unsigned().references('id').inTable('conta_corrente').notNullable(),
			table.integer('id_conta_destino').unsigned().references('id').inTable('conta_corrente').notNullable(),
			table.timestamp('created_at'),
			table.timestamp('updated_at')
		})
	}

	async down() {
		this.schema.dropTable(this.tableName)
	}
}