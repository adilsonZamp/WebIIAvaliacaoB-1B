import { TransacaoSchema } from '#database/schema'
import { belongsTo, column, dateTimeColumn } from '@adonisjs/lucid/orm'
import ContaCorrente from './conta_corrente.ts'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class Transacao extends TransacaoSchema {
    public static table = "transacao"
    
    @column({ isPrimary: true })
    declare id: number
    @column()
    declare valor: number
    @dateTimeColumn()
    declare data: DateTime
    @column()
    declare tipo: string

    @column({columnName: 'id_conta_origem'})
    declare idContaOrigem: number
    @belongsTo(() => ContaCorrente, {
        foreignKey: 'idContaOrigem',
    })
    declare contaOrigem: BelongsTo<typeof ContaCorrente>
    @column({columnName: 'id_conta_destino'})
    declare idContaDestino: number
    @belongsTo(() => ContaCorrente, {
        foreignKey: 'idContaDestino',
    })
    declare contaDestino: BelongsTo<typeof ContaCorrente>
}