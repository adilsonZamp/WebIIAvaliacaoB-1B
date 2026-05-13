import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'logado.profile.show': { paramsTuple?: []; params?: {} }
    'logado.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'conta_corrente.store': { paramsTuple?: []; params?: {} }
    'users.listar_clientes_sem_conta': { paramsTuple?: []; params?: {} }
    'transacaos.store': { paramsTuple?: []; params?: {} }
    'transacaos.listar_transcoes_cliente': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'logado.profile.show': { paramsTuple?: []; params?: {} }
    'users.listar_clientes_sem_conta': { paramsTuple?: []; params?: {} }
    'transacaos.listar_transcoes_cliente': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'logado.profile.show': { paramsTuple?: []; params?: {} }
    'users.listar_clientes_sem_conta': { paramsTuple?: []; params?: {} }
    'transacaos.listar_transcoes_cliente': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'logado.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'conta_corrente.store': { paramsTuple?: []; params?: {} }
    'transacaos.store': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}