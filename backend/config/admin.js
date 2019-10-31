module.exports = middleware => {
    // filtro de verificação de usuário
    return (req, res, next) => {
        // se o usuário for administrador ira passar o middleware e executar normalmente
        if(req.user.admin) {
            middleware(req, res, next)
        } else {
            res.status(401).send('Usuário não é administrador.')
        }
    }
}