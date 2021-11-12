const User = require("../models/user")
const Contact = require("../models/contact")
const jwt = require("jsonwebtoken")
const dataLayer = require("../data-layer/data-layer-provider").getDataLayer()

function processUserData(req, res, next) {
    const user = new User(req.body.email, req.body.password)
    var errors = user.validate()

    if (errors.length != 0) {
        return res.status(400).json(errors)
    }

    req.user = user

    next()
}

async function processContactData(req, res, next) {
    const contact = new Contact(req.body.lastName, req.body.firstName, req.body.phone, req.body.address, null)

    var errors = contact.validate()

    if (errors.length != 0) {
        return res.status(400).json(errors)
    }

    const user = await dataLayer.getUserByEmail(req.user.email)
    contact.owner = user.id
    res.contact = contact

    next()
}

function authenticateUser(req, res, next) {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]
    if (!token) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

module.exports = {
    processUserData,
    processContactData,
    authenticateUser,
}
