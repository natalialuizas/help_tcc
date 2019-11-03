module.exports = app => {
  // exportando as validações da api de validação
  const { existsOrError, notExistsOrError } = app.api.validation;

  // função de save é utiliza para inserir e alterar
  const save = (req, res) => {
    //  recebendo json da requisão
    const problem = {
      id: req.body.id,
      description: req.body.description,
      softwareId: req.body.softwareId,
      solution: req.body.solution,
      type: req.body.type
    };
    // verificando se o id está setado
    if (req.params.id) problem.id = req.params.id;

    try {
      // verifica se a descrição do problems está setado, exibe a mensagem de erro
      existsOrError(problem.description, "Descrição do prpblema não informado");
    } catch (msg) {
      // caso esteja setado, ele retorna status 400
      return res.status(400).send(msg);
    }

    /*
     * Verifica se o id do problems está setado, caso seja verdadeiro atualiza,
     *  caso contrario insere no banco novo problems
     */

    if (problem.id) {
      app
        .db("problems")
        .update(problem)
        .where({ id: problem.id })
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err));
    } else {
      app
        .db("problems")
        .insert(problem)
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err));
    }
  };
   const limit = 10; // usado para paginação
   const get = async (req, res) => {
     const page = req.query.page || 1;

     const result = await app
       .db("problems")
       .count("id")
       .first();
     const count = parseInt(result.count);

     app
       .db("problems")
       .select("id", "description", "softwareId", "solution", "type")
       .limit(limit)
       .offset(page * limit - limit)
       .then(problems => res.json({ data: problems, count, limit }))
       .catch(err => res.status(500).send(err));
   };
  
  // listando sem paginação
  const getList = (req, res) => {
    app
      .db("problems")
      .select("id", "description")
      .then(problems => res.json(problems))
      .catch(err => res.status(500).send(err));
  };

  const getById = (req, res) => {
    app
      .db("problems")
      .select("id", "description", "softwareId", "solution", "type")
      .where({ id: req.params.id })
      .first()
      .then(problem => res.json(problem))
      .catch(err => res.status(500).send(err));
  };
  // removendo o problems
  const remove = async (req, res) => {
    try {
      existsOrError(req.params.id, "Código do problems não informado.");

      const rowsDeleted = await app
        .db("problems")
        .where({ id: req.params.id })
        .del();
      existsOrError(rowsDeleted, "problems não foi encontrado.");

      res.status(204).send();
    } catch (msg) {
      res.status(400).send(msg);
    }
  };

  return { save, remove, get, getById, getList };
};
