module.exports = app => {
    const Stat = app.mongoose.model('Stat', {
        users: Number,
        tickets: Number,
        softwares: Number,
        createdAt: Date
    })

    const get = (req, res) => {
        Stat.findOne({}, {}, { sort: { 'createdAt': -1 } })
            // retorna a estatica
            .then(stat => {
                const defaultStat = {
                    users: 0,
                    tickets: 0,
                    softwares: 0
                }
                res.json(stat || defaultStat)
            })
    }

    return { Stat, get }
}