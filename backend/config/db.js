// importando o arquivo de configuração da raiz
const config = require('../knexfile.js')
// estanciano knex e passando arquivo de configuração
const knex = require('knex')(config)

// irá criar as tabelas do banco automaticamente quando iniciar aplicação
knex.migrate.latest([config])
module.exports = knex