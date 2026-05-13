import ContaCorrente from "#models/conta_corrente"
import ContaCorrenteTransformer from "#transformers/conta_corrente_transformer"
import { criarContaCorrenteValidator } from "#validators/conta_corrente"
import { HttpContext } from "@adonisjs/core/http"

export default class ContaCorrenteController {
    async store({ request, serialize }: HttpContext) {
        const { numeroAgencia, digito, idUsuario, saldo } = await request.validateUsing(criarContaCorrenteValidator)
        
        const contaCorrente = await ContaCorrente.create({ numeroAgencia, digito, idUsuario, saldo })
    
        return serialize({
          contaCorrente: ContaCorrenteTransformer.transform(contaCorrente)
        })
    }
}