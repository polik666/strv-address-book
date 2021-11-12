if (process.env.NODE_ENV !== "remote") {
    require("dotenv").config()
}

const express = require("express")
const app = express()

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

require("./utils/swagger-helper").initializeSwaggger(app)

app.use(express.json())

const accountRouter = require("./routes/account")
const contanctsRouter = require("./routes/contacts")

app.use("/account", accountRouter)
app.use("/contacts", contanctsRouter)

app.listen(process.env.PORT, () => console.log(`Server started on ${process.env.PORT}`))

module.exports = app
