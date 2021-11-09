require('dotenv').config()

const express = require('express')
const app = express();
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to database'))

app.use(express.json())

const accountRouter = require('./routes/account')
const contanctsRouter = require('./routes/contacts')

app.use('/account', accountRouter)
app.use('/contacts', contanctsRouter)

app.listen(3000, () => console.log('Server started '))