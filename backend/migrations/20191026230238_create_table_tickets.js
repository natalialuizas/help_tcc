
exports.up = function(knex, Promise) {
    return knex.schema.createTable("tickets", table => {
      table.increments("id").primary();
      table
        .integer("clientId")
        .references("id")
        .inTable("clients")
        .notNull();
      table
        .integer("softwareId")
        .references("id")
        .inTable("softwares")
        .notNull();
      table
        .integer("problemId")
        .references("id")
        .inTable("problems")
        .notNull();
      table
        .integer("userId")
        .references("id")
        .inTable("users")
        .notNull();
      table.string("status")
      table.string("solicitante") 
      table.string("description", 1000) 
      table.string("date")
    });
};

exports.down = function(knex, Promise) {
      return knex.schema.dropTable("tickets");
  
};
