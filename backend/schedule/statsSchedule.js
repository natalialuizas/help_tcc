const schedule = require('node-schedule')

module.exports = app => {
    schedule.scheduleJob('*/1 * * * *', async function () {
        const usersCount = await app.db('users').count('id').first()
        const softwaresCount = await app.db('softwares').count('id').first()
        const ticketsCount = await app.db('tickets').count('id').first()

        // exportando o modulo
        const { Stat } = app.api.stat

        // ultima estatica do banco
        const lastStat = await Stat.findOne({}, {},
            // ultima estatica dentro do mongodb
            { sort: { 'createdAt' : -1 } })

        // criando uma nova estatica
        const stat = new Stat({
            users: usersCount.count,
            softwares: softwaresCount.count,
            tickets: ticketsCount.count,
            createdAt: new Date()
        })

        const changeUsers = !lastStat || stat.users !== lastStat.users
        const changeSoftwares = !lastStat || stat.softwares !== lastStat.softwares
        const changeTickets = !lastStat || stat.tickets !== lastStat.tickets

        if(changeUsers || changeSoftwares || changeTickets) {
            stat.save().then(() => console.log('[MongoDB] Estatíticas atualizadas!'))
        }
    })
}