const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcryptjs')

module.exports = app => {
    
    const signin = async (req, res) => {
        // validando email e senha da requisão
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Informe usuário e senha!')
        }
        // obtendo o usuário do banco de dados
        const user = await app.db('users')
            .where({ email: req.body.email })
            .first()
        // verificando se o usuário existe
        if (!user) return res.status(400).send('Usuário não encontrado!')
        
        // comparando a senha
        const isMatch = bcrypt.compareSync(req.body.password, user.password)
        // se não for igual, retorna o status 401 - acesso não autorizado
        if (!isMatch) return res.status(401).send('Email/Senha inválidos!')

        // if (req.body.deletedAt != '') return res.status(400).send("Usuário não posssui mais acesso!");

        // capturando a data atual
        const now = Math.floor(Date.now() / 1000)
        
        // conteudo do token
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            // "iat: emitido em" data de geração do token
            iat: now,
            // "exp: data de expirasão" o token vale por três dias
            exp: now + (60 * 60 * 24 * 3)
        }
    
        res.json({
          // mandando resposta do token
          ...payload,
          // gerando o token e mandando para usuário
          token: jwt.encode(payload, authSecret)
        });
    }
   
    // função de validação do token
    const validateToken = async (req, res) => {
        // caso o body não vim setado, ele vem null
        const userData = req.body || null
        try {
            if (userData) {
                // descodificar token
                const token = jwt.decode(userData.token, authSecret)
                // verifica a data de expiração, se a data maior significa que token ainda está valido
                if(new Date(token.exp * 1000) > new Date()) {
                    return res.send(true)
                }
            }
        } catch(e) {
            // problema com o token
        }

        res.send(false)
    }

    return { signin, validateToken }
}