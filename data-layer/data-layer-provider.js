function getDataLayer() {
    if (process.env.NODE_ENV === "test") {
        const inMem = require("./in-memory/in-memory")
        return inMem
    } else {
        const db = require("./database/database")
        return db
    }
}

module.exports = { getDataLayer }
