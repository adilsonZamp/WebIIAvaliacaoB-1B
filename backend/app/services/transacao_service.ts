import ContaCorrente from '#models/conta_corrente'
import Transacao from '#models/transacao'
import { criarTransacaoValidator } from '#validators/transacao'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export class TransacaoService {
	static async executar(payload: any, request: any) {
		const base = await db.transaction()

		try {
			const conta = await ContaCorrente
				.query({ client: base })
				.where('id', payload.idContaOrigem)
				.firstOrFail()

			if (conta.saldo < payload.valor) {
				throw new Error('Saldo insuficiente')
			}
			if (0 >= payload.valor) {
				throw new Error('Valor inválido')
			}

			const { valor = payload.valor,
				data = DateTime.now(),
				tipo = 'Saida',
				idContaOrigem = conta.id,
				idContaDestino = payload.idContaDestino
			} = await request.validateUsing(criarTransacaoValidator)
			const transacao = await Transacao.create({valor,data,tipo,idContaOrigem,idContaDestino}, { client: base })

			conta.saldo -= payload.valor
			await conta.save()
			await base.commit()

			return transacao
		} catch (error) {
			await base.rollback()
			throw error
		}
	}
}
