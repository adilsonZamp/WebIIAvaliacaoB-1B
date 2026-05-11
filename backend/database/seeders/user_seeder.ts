import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.create({
      id: 1,
      nome: 'Gerente padrão',
      email: 'gerente@banif.com',
      password: '12345678',
      tipo: 'Gerente'
    })
  }
}