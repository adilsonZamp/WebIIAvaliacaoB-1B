import vine from '@vinejs/vine'

export const criarContaCorrenteValidator = vine.create({
    numeroAgencia: vine.string().minLength(1).maxLength(7),
    digito: vine.string().minLength(1).maxLength(1),
    idUsuario: vine.number().positive(),
    saldo: vine.number().positive()
})