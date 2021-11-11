
if (process.env.NODE_ENV !== 'remote') {
    require('dotenv').config();
}

const express = require('express')
const app = express();

if(process.env.NODE_ENV !== 'test'){
    // initialize mongo
    const mongoose = require('mongoose')
    mongoose.connect(process.env.DB_MONGO_URL)
    const db = mongoose.connection
    db.on('error', (error) => console.error(error))
    db.once('open', () => console.log('Connected to database'))

    // initialize firebase
    const admin = require("firebase-admin");
    const serviceAccount = require(process.env.FIREBASE_CERT_PATH)
    
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.DB_FIREBASE_URL
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

app.listen(process.env.API_PORT, () => console.log(`Server started on ${process.env.API_PORT}`))

module.exports = app