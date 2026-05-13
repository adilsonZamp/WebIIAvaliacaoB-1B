import vine from '@vinejs/vine'

//usando regras gerais
/**
 * Shared rules for email and password.
  */
// const email = () => vine.string().email().maxLength(254)
// const password = () => vine.string().minLength(8).maxLength(32)

/**quando for usar o request.validateUsing(validator_aqui) no controller
 * Validator to use when performing self-signup
 */
export const criarContaCorrenteValidator = vine.create({
    numeroAgencia: vine.string().minLength(1).maxLength(7),
    digito: vine.string().minLength(1).maxLength(1),
    idUsuario: vine.number().positive(),
    saldo: vine.number().positive()
})