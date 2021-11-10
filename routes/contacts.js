const express = require('express')
const jwt = require('jsonwebtoken')

const router = express.Router()
const Contact = require('../models/contact')
const dataLayer =  require('../data-layer/data-layer-provider').getDataLayer();

router.get('/create', authenticateUser, processContactData, (req, res) => {
    res.json(res.contact)
})

function authenticateUser(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) 
        return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

async function processContactData(req, res, next) {
    if(!req.body.lastName){
         return res.status(400).json({message: 'Missing required fields', fields: ['LastName']})
    }
    const user = await dataLayer.getUserByEmail(req.user)
    var contact = new Contact(req.body.lastName, req.body.firstName, req.body.phone, req.body.address, user.email)
    res.contact = contact;
    
    next()
}

module.exports = router;