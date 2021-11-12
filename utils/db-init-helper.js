function initDatabases() {
    // initialize mongo
    const mongoose = require("mongoose")
    mongoose.connect(process.env.DB_MONGO_URL)
    const db = mongoose.connection
    db.on("error", (error) => console.error(error))
    db.once("open", () => console.log("Connected to database"))

    // initialize firebase
    const admin = require("firebase-admin")
    const serviceAccount = require(process.env.FIREBASE_CERT_PATH)

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.DB_FIREBASE_URL,
    })

    console.log("Firebase initialized")
}

module.exports = { initDatabases }
