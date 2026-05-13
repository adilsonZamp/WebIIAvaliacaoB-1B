import User from '#models/user';

export default class UsersController {
    async listarClientesSemConta() {
        const clientes = await User.query().select(['id', 'nome', 'cpf']).where('tipo', 'Cliente')
            .whereDoesntHave('contaCorrente', (query) => {
                query.whereNotNull('id_usuario')
            })
        return clientes
    }
}