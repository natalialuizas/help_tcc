
exports.up = function (knex, Promise) {
  return knex.schema.createTable('softwares', table => {
    table.increments('id').primary();
    table.string('nameSoftware').notNull()
    table.timestamps();
  })
  
};

exports.down = function(knex, Promise) {
   return knex.schema.dropTable('softwares')
};
