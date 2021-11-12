function initDatabases() {
    // initialize mongo
    const mongoose = require("mongoose")
    mongoose.connect(process.env.DB_MONGO_URL)
    const db = mongoose.connection
    db.on("error", (error) => console.error(error))
    db.once("open", () => console.log("Connected to database"))

    // initialize firebase
    const admin = require("firebase-admin")
    admin.initializeApp({
        credential: admin.credential.cert({
            type: process.env.FIREBASE_CERT_TYPE,
            project_id: process.env.FIREBASE_CERT_PROJECT_ID,
            private_key_id: process.env.FIREBASE_CERT_PRIVATE_KEY_ID,
            private_key: process.env.FIREBASE_CERT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            client_email: process.env.FIREBASE_CERT_CLIENT_EMAIL,
            client_id: process.env.FIREBASE_CERT_CLIENT_ID,
            auth_uri: process.env.FIREBASE_CERT_AUTH_URI,
            token_uri: process.env.FIREBASE_CERT_TOKEN_URI,
            auth_provider_x509_cert_url: process.env.FIREBASE_CERT_AUTH_PROVIDER_X509_CERT_URL,
            client_x509_cert_url: process.env.FIREBASE_CERT_CLIENT_X509_CERT_URL,
        }),
        databaseURL: process.env.DB_FIREBASE_URL,
    })

    console.log("Firebase initialized")
}

module.exports = { initDatabases }
