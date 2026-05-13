import { BaseTransformer } from '@adonisjs/core/transformers'
import Transacao from '#models/transacao'

export default class TransacaoTransformer extends BaseTransformer<Transacao> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'valor',
      'idContaOrigem',
      'idContaDestino',
      'tipo',
      'data'
    ])
  }
}