import Transacao from "#models/transacao"
import { TransacaoService } from "#services/transacao_service"
import TransacaoTransformer from "#transformers/transacao_transformer"
import { HttpContext } from "@adonisjs/core/http"

export default class TransacaosController {
    async store({ request, serialize }: HttpContext) {
        const payload = request.only([
            'idContaOrigem',
            'idContaDestino',
            'valor'
        ])
        
        const transacao = await TransacaoService.executar(payload, request)
    
        return serialize({
          transacao: TransacaoTransformer.transform(transacao)
        })
    }
    
    async listarTranscoesCliente({ params, serialize }: HttpContext) {
        const transacao = await Transacao.query().where('id_conta_origem', params.id).orderBy('data', 'desc')
    
        return serialize({
          transacao: TransacaoTransformer.transform(transacao)
        })
    }
}