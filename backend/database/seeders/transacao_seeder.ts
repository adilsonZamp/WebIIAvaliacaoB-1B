import Transacao from '#models/transacao'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
	async run() {
		await Transacao.createMany(
			[
				{
					valor: 10.5,
					data: DateTime.now(),
					tipo: 'Saida',
					idContaOrigem: 1,
					idContaDestino: 2
				},
				{
					valor: 20,
					data: DateTime.now(),
					tipo: 'Saida',
					idContaOrigem: 1,
					idContaDestino: 2
				},
				{
					valor: 10,
					data: DateTime.now(),
					tipo: 'Saida',
					idContaOrigem: 2,
					idContaDestino: 1
				},
			])
	}
}
/*
valor: vine.number().positive(),
data: vine.date(),
tipo: vine.string(),
idContaOrigem: vine.number().positive().withoutDecimals(),
idContaDestino: vine.number().positive().withoutDecimals()
*/