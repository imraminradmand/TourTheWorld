const app = require('./app')
const dotenv = require('dotenv')

dotenv.config({ path: './congif.env'})

console.log(process.env)
//SERVER START
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`App running on port ${port}...`)
})
