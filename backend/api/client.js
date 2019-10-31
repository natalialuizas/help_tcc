module.exports = app => {
    // exportando as validações da api de validação
    const { existsOrError, notExistsOrError } = app.api.validation

    // função de save é utiliza para inserir e alterar 
    const save = (req, res) => {
        //  recebendo json da requisão
        const client = {
          id: req.body.id,
          razaoSocial: req.body.razaoSocial,
          nomeFantasia: req.body.nomeFantasia,
          cnpj: req.body.cnpj,
          ie: req.body.ie,
          endereco: req.body.endereco,
          bairro: req.body.bairro,
          cidade: req.body.cidade,
          cep: req.body.cep,
          estado: req.body.estado,
          telefone: req.body.telefone,
          celular: req.body.celular,
          email: req.body.email,
          
        };
        // verificando se o id está setado
        if(req.params.id) client.id = req.params.id
    
        try {
              // verificando se os campos estão preenchidos, exibir mensagem de erro
              existsOrError(client.razaoSocial, "Razão Social não informado");
              existsOrError(client.nomeFantasia, "Nome Fantasia não informado");
              existsOrError(client.cnpj, "CNPJ não informado");
              existsOrError(client.ie, "Inscrição Estadual não informado");
              existsOrError(client.endereco, "Endereço não informado");
              existsOrError(client.bairro, "Bairro não informado");
              existsOrError(client.cidade, "Cidade não informado");
              existsOrError(client.cep, "CEP não informado");
              existsOrError(client.estado, "Estado não informado");
              existsOrError(client.telefone, "Telefone não informado");
              existsOrError(client.celular, "Celular não informado");
              existsOrError(client.email, "email não informado");

              // verifica o tamanho da string passada, se for menor ou igual a 15, exibe o erro
              if (client.cnpj.length <= 15) {
                notExistsOrError(client.cnpj, "CNPJ Invalido");
              }
          
              // verifica o tamanho da string passada, se for menor ou igual a 12, exibe o erro
              if (client.ie.length <= 12) {
                notExistsOrError(client.ie, "Inscrição Estadual Invalido");
              }
            } catch (msg) {
          return res.status(400).send(msg)
          
        }

        /*
         * Verifica se o id do cliente está setado, caso seja verdadeiro atualiza, 
         *  caso contrario insere no banco novo cliente
         */

        if(client.id) {
            app.db('clients')
                .update(client)
                .where({ id: client.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('clients')
                .insert(client)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }
  
   const limit = 10; // usado para paginação
   const get = async (req, res) => {
     const page = req.query.page || 1;

     const result = await app
       .db("clients")
       .count("id")
       .first();
     const count = parseInt(result.count);

     app
       .db("clients")
       .select(
         "id",
         "razaoSocial",
         "nomeFantasia",
         "cnpj",
         "ie",
         "endereco",
         "bairro",
         "cidade",
         "cep",
         "estado",
         "telefone",
         "celular",
         "email"
       )
       .limit(limit)
       .offset(page * limit - limit)
       .then(clients => res.json({ data: clients, count, limit }))
       .catch(err => res.status(500).send(err));
   };
  
  const getList = (req, res) => {
    app
      .db("clients")
      .select("id", "nomeFantasia")
      //  .whereNull("deletedAt")
      .then(clients => res.json(clients))
      .catch(err => res.status(500).send(err));
  };


   const getById = (req, res) => {
     app
       .db("clients")
       .select(
         "id",
         "razaoSocial",
         "nomeFantasia",
         "cnpj",
         "ie",
         "endereco",
         "bairro",
         "cidade",
         "cep",
         "estado",
         "telefone",
         "celular",
         "email"
       )
       .where({ id: req.params.id })
       .first()
       .then(client => res.json(client))
       .catch(err => res.status(500).send(err));
   }
   // removendo o cliente
    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, 'Código do cliente não informado.')

            const ticket = await app.db('tickets')
                .where({ clientId: req.params.id })
            notExistsOrError(ticket, 'cliente possui chamados.')

            const rowsDeleted = await app.db('clients')
                .where({ id: req.params.id }).del()
            existsOrError(rowsDeleted, 'cliente não foi encontrado.')

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    return { save, remove, get, getById, getList }
}