
exports.up = function (knex, Promise) {
  return knex.schema.createTable("softwares", table => {
    table.increments("id").primary();
    table
      .string("nameSoftware")
      .notNull()
      .unique();
    table.timestamps();
  });
  
  
};

exports.down = function(knex, Promise) {
   return knex.schema.dropTable("softwares");
};
