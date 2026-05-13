import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.createMany(
      [
        {
          id: 0,
          nome: 'Gerente Padrão',
          cpf: '00000000000',
          email: 'gerente@banif.com',
          password: '12345678',
          tipo: 'Gerente'
        },
        {
          nome: 'Cliente Padrão 1',
          cpf: '11111111111',
          email: 'a1@banif.com',
          password: '12345678',
          tipo: 'Cliente'
        },
        {
          nome: 'Cliente Padrão 2',
          cpf: '22222222222',
          email: 'a2@banif.com',
          password: '12345678',
          tipo: 'Cliente'
        },
      ])
  }
}