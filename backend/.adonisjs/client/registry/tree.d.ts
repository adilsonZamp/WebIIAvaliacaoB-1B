/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessTokens: {
      store: typeof routes['auth.access_tokens.store']
    }
  }
  logado: {
    profile: {
      show: typeof routes['logado.profile.show']
    }
    accessTokens: {
      destroy: typeof routes['logado.access_tokens.destroy']
    }
  }
  contaCorrente: {
    store: typeof routes['conta_corrente.store']
  }
  users: {
    listarClientesSemConta: typeof routes['users.listar_clientes_sem_conta']
  }
  transacaos: {
    store: typeof routes['transacaos.store']
    listarTranscoesCliente: typeof routes['transacaos.listar_transcoes_cliente']
  }
}
