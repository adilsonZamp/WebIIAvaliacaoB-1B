import User from '#models/user';

export default class UsersController {
    async listarClientes() {
        const clientes = await User.query().select(['id', 'nome', 'cpf']).where('tipo', 'Cliente')
        return clientes
    }
}