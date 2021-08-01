const app = require('./app')

//SERVER START
const port = 3000
app.listen(port, () => {
    console.log(`App running on port ${port}...`)
})
