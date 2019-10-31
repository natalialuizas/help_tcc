module.exports = app => {
  // exportando as validações da api de validação
  const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

  // função de save é utiliza para inserir e alterar 
  const save = (req, res) => {
    //  recebendo json da requisão
    const software = {
      id: req.body.id,
      nameSoftware: req.body.nameSoftware
    };
    // verificando se o id está setado
    if (req.params.id) software.id = req.params.id

    try {
      // verifica se o nome do software está setado, exibe a mensagem de erro
      existsOrError(
        software.nameSoftware,
        "Nome do Software não informado"
      )

      // verifica se o usuário já está cadastrado no banco de dados
      // const softwareFromDB = await app
      //   .db("softwares")
      //   .where({ nameSoftware: software.nameSoftware })
      //   .first();
      // if (!software.id) {
      //   notExistsOrError(softwareFromDB, "Software já cadastrado");
      // }
    } catch (msg) {
      // caso esteja setado, ele retorna status 400
      return res.status(400).send(msg)
    }

    /*
     * Verifica se o id do software está setado, caso seja verdadeiro atualiza, 
     *  caso contrario insere no banco novo software
     */

    if (software.id) {
      app.db('softwares')
        .update(software)
        .where({ id: software.id })
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err))
    } else {
      app.db('softwares')
        .insert(software)
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err))
    }
  }

   const limit = 5; // usado para paginação
   const get = async (req, res) => {
     const page = req.query.page || 1;

     const result = await app
       .db("softwares")
       .count("id")
       .first();
     const count = parseInt(result.count);

     app
       .db("softwares")
       .select("id", "nameSoftware")
       .limit(limit)
       .offset(page * limit - limit)
      //  .whereNull("deletedAt")
       .then(softwares => res.json({ data: softwares, count, limit }))
       .catch(err => res.status(500).send(err));
   };

  // listando sem paginação
   const getList = (req, res) => {
     app
       .db("softwares")
       .select("id", "nameSoftware")
       .then(softwares => res.json(softwares))
       .catch(err => res.status(500).send(err));
   };

  const getById = (req, res) => {
    app.db("softwares")
      .select("id", "nameSoftware")
      .where({ id: req.params.id })
      .first()
      .then(software => res.json(software))
      .catch(err => res.status(500).send(err));
  }
  // removendo o software
  const remove = async (req, res) => {
    try {
      existsOrError(req.params.id, 'Código do software não informado.')

      const problems = await app.db('problems')
        .where({ softwareId: req.params.id })
      notExistsOrError(problems, 'Software possui base de conhecimento cadastrada.')

      const rowsDeleted = await app.db('softwares')
        .where({ id: req.params.id }).del()
      existsOrError(rowsDeleted, 'Software não foi encontrado.')

      res.status(204).send()
    } catch (msg) {
      res.status(400).send(msg)
    }
  }


  return { save, remove, get, getById, getList }
}