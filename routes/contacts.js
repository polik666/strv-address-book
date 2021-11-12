const express = require("express")
const router = express.Router()
const middleware = require("../utils/middleware")
const dataLayer = require("../data-layer/data-layer-provider").getDataLayer()

router.post("/create", middleware.authenticateUser, middleware.processContactData, async (req, res) => {
    await dataLayer.createContact(res.contact)
    res.json(res.contact)
})

module.exports = router
