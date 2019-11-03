module.exports = app => {
    // exportando as validações da api de validação
    const { existsOrError, notExistsOrError } = app.api.validation

    // função de save é utiliza para inserir e alterar 
    const save = (req, res) => {
        //  recebendo json da requisão
        const ticket = {
          id: req.body.id,
          clientId: req.body.clientId,
          problemId: req.body.problemId,
          userId: req.body.userId,
          status: req.body.status,
          description: req.body.description,
          date: req.body.date,
          solicitante: req.body.solicitante
        };
        // verificando se o id está setado
        if(req.params.id) ticket.id = req.params.id
    
        try {
              // verificando se os campos estão preenchidos, exibir mensagem de erro
            existsOrError(ticket.clientId, "Cliente não informado");
            existsOrError(ticket.problemId, "Problema não informado");
            existsOrError(ticket.userId, "Usuário não informado");
            existsOrError(ticket.status, "Status não informado");
            existsOrError(ticket.description, "Descrição da solução não informado");
            existsOrError(ticket.date, "Data não informada");
            existsOrError(ticket.solicitante, "Descrição da solução não informado");
        } catch (msg) {
            return res.status(400).send(msg)
        }

        /*
         * Verifica se o id do ticket está setado, caso seja verdadeiro atualiza, 
         *  caso contrario insere no banco novo ticket
         */

        if(ticket.id) {
            app.db('tickets')
                .update(ticket)
                .where({ id: ticket.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('tickets')
                .insert(ticket)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }
   const limit = 10; // usado para paginação
  const get = async (req, res) => {
     // verifica qual é pagina
     const page = req.query.page || 1;

     const result = await app
       .db("tickets")
       // pegando quantidade de registro do banco de dados
       .count("id")
       // pegando primeiro registro
       .first();
     // convertando o count para inteiro
     const count = parseInt(result.count);

     app.db("tickets")
       .select(
         "id",
         "clientId",
         "problemId",
         "userId",
         "status",
         "description",
         "solicitante",
         "date"
       )
       .limit(limit) 
       // calculando os registros para exibição
       .offset(page * limit - limit)
       // retornando os chamados, contador e limite da paginação 
       .then(tickets => res.json({ data: tickets, count, limit }))
       .catch(err => res.status(500).send(err));
  };
  


   const getById = (req, res) => {
     app
       .db("tickets")
       .select("id", "clientId", "problemId","userId",  "status", "description", "solicitante", "date")
       .where({ id: req.params.id })
       .first()
       .then(ticket => res.json(ticket))
       .catch(err => res.status(500).send(err));
   }
   // removendo o ticket
    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, 'Código do ticket não informado.')

            const rowsDeleted = await app.db('tickets')
                .where({ id: req.params.id }).del()
            existsOrError(rowsDeleted, 'ticket não foi encontrado.')

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    return { save, remove, get, getById };
}