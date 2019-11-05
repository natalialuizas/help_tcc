
exports.up = function(knex, Promise) {
   return knex.schema.createTable("clients", table => {
     table.increments("id").primary();
     table.string("razaoSocial").notNull();
     table.string("nomeFantasia").notNull();
     table.string("cnpj").notNull();
     table.string("ie");
     table.string("endereco").notNull();
     table.string("bairro").notNull();
     table.string("cidade").notNull();
     table.string("cep");
     table.string("estado");
     table.string("telefone");
     table.string("celular");
     table.string("email");
     table.timestamps();
   });
};

exports.down = function(knex, Promise) {
   return knex.schema.dropTable("clients");
};
