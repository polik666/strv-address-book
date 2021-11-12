if (process.env.NODE_ENV !== "remote") {
    require("dotenv").config()
}

const express = require("express")
const app = express()

require("./utils/db-init-helper").initDatabases()
require("./utils/swagger-helper").initializeSwaggger(app)

app.use(express.json())

const accountRouter = require("./routes/account")
const contanctsRouter = require("./routes/contacts")

app.use("/account", accountRouter)
app.use("/contacts", contanctsRouter)

app.listen(process.env.PORT, () => console.log(`Server started on ${process.env.PORT}`))

module.exports = app
