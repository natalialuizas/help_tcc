const bcrypt = require('bcryptjs')

module.exports = app => {
  // exportando as validações da api de validação
  const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

  // criptografando a senha
  const encryptPassword = password => {
    // gerando a senha
    const salt = bcrypt.genSaltSync(10);
    // retornando hash da senha
    return bcrypt.hashSync(password, salt);
  };

  const save = async (req, res) => {
    // pegando requisão json
    const user = { ...req.body };
    // verificando se o id do usuário está setado
    if (req.params.id) user.id = req.params.id;

    if (!req.originalUrl.startsWith("/users")) user.admin = false;
    if (!req.user || !req.user.admin) user.admin = false;

    // fazendo as verificações dos campos
    try {
      existsOrError(user.name, "Nome não informado");
      existsOrError(user.email, "E-mail não informado");
      existsOrError(user.password, "Senha não informada");
      existsOrError(user.confirmPassword, "Confirmação de Senha inválida");
      equalsOrError(user.password, user.confirmPassword, "Senhas não conferem");

      // verifica se o usuário já está cadastrado no banco de dados
      const userFromDB = await app
        .db("users")
        .where({ email: user.email })
        .first();
      if (!user.id) {
        notExistsOrError(userFromDB, "Usuário já cadastrado");
      }
    } catch (msg) {
      return res.status(400).send(msg);
    }

    user.password = encryptPassword(user.password);
    delete user.confirmPassword;

    if (user.id) {
      app
        .db("users")
        .update(user)
        .where({ id: user.id })
        .whereNull("deletedAt")
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err));
    } else {
      app
        .db("users")
        .insert(user)
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err));
    }
  };
  const limit = 5 // usado para paginação
  const get = async (req, res) => {
    const page = req.query.page || 1

    const result = await app
      .db("users")
      .count("id")
      .first();
    const count = parseInt(result.count)

    app
      .db("users")
      .select("id", "name", "email", "admin")
      .limit(limit)
      .offset(page * limit - limit)
      .whereNull("deletedAt")
      .then(users => res.json({ data: users, count, limit }))
      .catch(err => res.status(500).send(err));
  };

   const getList = (req, res) => {
     app
       .db("users")
       .select("id", "name")
       .then(users => res.json(users))
       .catch(err => res.status(500).send(err));
   };

  const getById = (req, res) => {
    app
      .db("users")
      .select("id", "name", "email", "admin")
      .where({ id: req.params.id })
      .whereNull("deletedAt")
      .first()
      .then(user => res.json(user))
      .catch(err => res.status(500).send(err));
  };

  const remove = async (req, res) => {
    try {
      const tickets = await app.db("tickets").where({ userId: req.params.id });
      notExistsOrError(tickets, "Usuário possui tickets.");

      const rowsUpdated = await app
        .db("users")
        .update({ deletedAt: new Date() })
        .where({ id: req.params.id });
      existsOrError(rowsUpdated, "Usuário não foi encontrado.");

      res.status(204).send();
    } catch (msg) {
      res.status(400).send(msg);
    }
  };

  return { save, get, getById, remove, getList };
};
