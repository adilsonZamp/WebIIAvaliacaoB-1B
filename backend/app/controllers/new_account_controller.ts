import User from '#models/user'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'
import mail from '@adonisjs/mail/services/main'

export default class NewAccountController {
  async store({ request, serialize }: HttpContext) {
    const { nome, email, cpf, password, tipo, cidade, estado, rua, numero } = await request.validateUsing(signupValidator)
    const template = '<!DOCTYPE html><html><body style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">    <h2>Bem-vindo, {{nome}}!</h2>    <p>Seu cadastro foi realizado com sucesso.</p>    <p>Agora você já pode acessar a plataforma com as seguintes credenciais:</p>    <ul>        <li><strong>Email:</strong> {{email}}</li>        <li><strong>Senha:</strong> {{password}}</li>    </ul>    <p>        Recomendamos que você altere sua senha no primeiro acesso por segurança.    </p><br>    <p>Seja bem-vindo!</p>    <p><strong>Equipe de suporte</strong></p></body></html>';
    
    const user = await User.create({ nome, email, cpf, password, tipo, cidade, estado, rua, numero })
    const token = await User.accessTokens.create(user)
    const html = template.replace('{{nome}}', nome)
        .replace('{{email}}', email)
        .replace('{{password}}', password)

    await mail.send((mensagem) => {
      mensagem.to(email).subject('Boas vindas ao BANIF').html(html)
    })

    return serialize({
      user: UserTransformer.transform(user),
      token: token.value!.release(),
    })
  }
}
