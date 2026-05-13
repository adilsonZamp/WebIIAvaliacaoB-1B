import ContaCorrente from '#models/conta_corrente'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class ContaCorrenteSeeder extends BaseSeeder {
  async run() {
    await ContaCorrente.createMany(
      [
        {
          numeroAgencia: '1111111',
          digito: '1',
          idUsuario: 1,
          saldo: 100
        },
        {
          numeroAgencia: '2222222',
          digito: '2',
          idUsuario: 2,
          saldo: 100
        },
      ])
  }
}
/*
numeroAgencia: vine.string().minLength(1).maxLength(7),
digito: vine.string().minLength(1).maxLength(1),
idUsuario: vine.number().positive(),
saldo: vine.number().positive()
*/