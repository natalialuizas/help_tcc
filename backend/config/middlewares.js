const bodyParser = require('body-parser')
// cors faz comunicação entre o backend e frontend
const cors = require('cors')


module.exports = app => {
    app.use(bodyParser.json())
    app.use(cors())
}