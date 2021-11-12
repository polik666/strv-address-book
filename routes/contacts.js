const express = require('express')
const router = express.Router()
const middleware = require('../utils/middleware')
const dataLayer =  require('../data-layer/data-layer-provider').getDataLayer();

router.post('/create', middleware.authenticateUser, middleware.processContactData, async (req, res) => {
    try {
        await dataLayer.createContact(res.contact)
        res.json(res.contact)
    } catch (err) {
        console.error(err)
        res.status(500).send()
    }
})

module.exports = router;