import { ContaCorrenteSchema } from '#database/schema'
import { column } from '@adonisjs/lucid/orm'

export default class ContaCorrente extends ContaCorrenteSchema {
    public static table = "conta_corrente"

    @column({columnName:'id_usuario'})
    declare userId: number
}