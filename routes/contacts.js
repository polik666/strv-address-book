const express = require('express')
const jwt = require('jsonwebtoken')

const router = express.Router()

router.get('/', authenticateUser, (req, res) => {
    res.json(['x', 'xx', 'xxx'])
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

module.exports = router;