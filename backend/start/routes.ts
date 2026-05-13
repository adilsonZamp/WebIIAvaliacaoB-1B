/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/', () => {
  return { hello: 'dev' }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessTokens, 'store'])
      })
      .as('auth')

    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show'])
        router.post('logout', [controllers.AccessTokens, 'destroy'])
      })
      .as('logado')
      .use(middleware.auth())

    router.group(() => {
      router.post('criarContaCorrente', [controllers.ContaCorrente, 'store'])
      router.get('listarClientes', [controllers.Users, 'listarClientesSemConta'])
      router.post('criarTransacao', [controllers.Transacaos, 'store'])
      router.get('listarTransacoesCliente/:id', [controllers.Transacaos, 'listarTranscoesCliente'])
    }).use(middleware.auth())
  })
