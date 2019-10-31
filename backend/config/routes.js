
const admin = require('./admin')


module.exports = app => {
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)

    //  rota de usuários
    app.route('/users')
        .all(app.config.passport.authenticate())
        .post(admin(app.api.user.save))
       .get(admin(app.api.user.get))
  
    app.route('/usersList')
      .all(app.config.passport.authenticate())
      .get(app.api.user.getList);
    

    app.route('/users/:id')
        .all(app.config.passport.authenticate())
        .put(admin(app.api.user.save))
        .get(admin(app.api.user.getById))
        .delete(admin(app.api.user.remove))

    // rota de softwares
  app.route("/softwaresList")
    .all(app.config.passport.authenticate())
    .get(app.api.software.getList)
  
    app
      .route("/softwares")
      .all(app.config.passport.authenticate())
      .get(app.api.software.get)
      .post(app.api.software.save);

    app.route('/softwares/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.software.getById)
        .put(app.api.software.save)
        .delete(app.api.software.remove)
    
    // rota de problemas
  
    app.route("/problemsList")
      .all(app.config.passport.authenticate())
      .get(app.api.problem.getList);
    
    app.route('/problems')
        .all(app.config.passport.authenticate())
        .get(app.api.problem.get)
        .post(app.api.problem.save)
    
    app.route('/problems/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.problem.getById)
        .put(app.api.problem.save)
      .delete(app.api.problem.remove)
  
   app
     .route('/clientsList')
     .all(app.config.passport.authenticate())
     .get(app.api.client.getList);
    
     //rota de clientes
    app.route('/clients')
      .all(app.config.passport.authenticate())
      .get(app.api.client.get)
      .post(app.api.client.save);
    
    app.route('/clients/:id')
      .all(app.config.passport.authenticate())
      .get(app.api.client.getById)
      .put(app.api.client.save)
      .delete(app.api.client.remove)

      //rota de chamados
     app.route("/tickets")
       .all(app.config.passport.authenticate())
       .get(app.api.ticket.get)
       .post(app.api.ticket.save);

     app.route("/tickets/:id")
       .all(app.config.passport.authenticate())
       .get(app.api.ticket.getById)
       .put(app.api.ticket.save)
       .delete(app.api.ticket.remove);

     app.route("/stats")
       .all(app.config.passport.authenticate())
       .get(app.api.stat.get);
    

}