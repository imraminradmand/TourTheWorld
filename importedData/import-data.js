const mongoose = require('mongoose')
const dotenv = require('dotenv')
const fs = require('fs')
const Tour = require('../models/tourModel')

dotenv.config({ path: './config.env'})

const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

//MONGOOSE CONNECTION 
mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    console.log('db connection success!')
})

//READ JSON 
const tours = JSON.parse(fs.readFileSync(`${__dirname}/initial.json`, 'utf-8'))

//IMPORT FUNCTION
const importData = async () => {
    try {
        await Tour.create(tours)
        console.log('data written to db')
        process.exit()
    } catch (err) {
        console.log(err)
    }
}

if(process.argv[2] === '--import') {
    importData()
}