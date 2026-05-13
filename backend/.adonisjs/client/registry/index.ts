/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.new_account.store': {
    methods: ["POST"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['auth.new_account.store']['types'],
  },
  'auth.access_tokens.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.access_tokens.store']['types'],
  },
  'logado.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/profile',
    tokens: [{"old":"/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['logado.profile.show']['types'],
  },
  'logado.access_tokens.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['logado.access_tokens.destroy']['types'],
  },
  'conta_corrente.store': {
    methods: ["POST"],
    pattern: '/criarContaCorrente',
    tokens: [{"old":"/criarContaCorrente","type":0,"val":"criarContaCorrente","end":""}],
    types: placeholder as Registry['conta_corrente.store']['types'],
  },
  'users.listar_clientes_sem_conta': {
    methods: ["GET","HEAD"],
    pattern: '/listarClientes',
    tokens: [{"old":"/listarClientes","type":0,"val":"listarClientes","end":""}],
    types: placeholder as Registry['users.listar_clientes_sem_conta']['types'],
  },
  'transacaos.store': {
    methods: ["POST"],
    pattern: '/criarTransacao',
    tokens: [{"old":"/criarTransacao","type":0,"val":"criarTransacao","end":""}],
    types: placeholder as Registry['transacaos.store']['types'],
  },
  'transacaos.listar_transcoes_cliente': {
    methods: ["GET","HEAD"],
    pattern: '/listarTransacoesCliente/:id',
    tokens: [{"old":"/listarTransacoesCliente/:id","type":0,"val":"listarTransacoesCliente","end":""},{"old":"/listarTransacoesCliente/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['transacaos.listar_transcoes_cliente']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
