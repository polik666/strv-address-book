require('dotenv').config()

const express = require('express')
const app = express();

if(process.env.NODE_ENV !== 'test'){
    // initialize mongo
    const mongoose = require('mongoose')
    mongoose.connect(process.env.DATABASE_URL)
    const db = mongoose.connection
    db.on('error', (error) => console.error(error))
    db.once('open', () => console.log('Connected to database'))

    // initialize firebase
    const admin = require("firebase-admin");
    const serviceAccount = require('./fbkey.json')
    
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://strv-addressbook-knotek-pavel-default-rtdb.europe-west1.firebasedatabase.app"
    });

    console.log('Firebase initialized')
}
else {
    console.log('Running in in-memory mode')
}

app.use(express.json())

const accountRouter = require('./routes/account')
const contanctsRouter = require('./routes/contacts')

app.use('/account', accountRouter)
app.use('/contacts', contanctsRouter)

app.listen(3000, () => console.log('Server started '))

module.exports = app