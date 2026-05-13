import { BaseTransformer } from '@adonisjs/core/transformers'
import ContaCorrente from '#models/conta_corrente'

export default class ContaCorrenteTransformer extends BaseTransformer<ContaCorrente> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'numeroAgencia',
      'digito',
      'saldo',
      'idUsuario'
    ])
  }
}