
exports.up = function (knex, Promise) {
    return knex.schema.createTable('problems', table => {
      table.increments("id").primary();
      table.string('description').notNull();
      table.integer('softwareId').references('id')
        .inTable('softwares')
      table.timestamps();
    })
  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('problems');
};
