import vine from '@vinejs/vine'

export const criarTransacaoValidator = vine.create({
    valor: vine.number().positive(),
    idContaOrigem: vine.number().positive().withoutDecimals(),
    idContaDestino: vine.number().positive().withoutDecimals()
})