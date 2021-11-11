const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const router = express.Router()

const User = require('../models/user')
const RefreshToken = require('../models/refresh-token')
const dataLayer =  require('../data-layer/data-layer-provider').getDataLayer();

router.get('/echo', (req, res) => {
    res.send('Hello worlds again')
})

router.post('/register', processUserData, async (req, res) =>  {
    try {
        if(await dataLayer.userExists(req.user.email)) {
            return res.status(400).send('User already exists')
        }

        const hashedPassword = await bcrypt.hash(req.user.password, 10)
        const user = new User(req.user.email, hashedPassword)
        dataLayer.createUser(user)
        const loginResponse = await prepareLoginRespose(user)
        res.json(loginResponse)
    } catch (err) {
        console.error(err)
        res.status(500).send()
    }
})

router.post('/login', processUserData, async (req, res) =>  {
    let user = null
    try {
        user = await dataLayer.getUserByEmail(req.user.email)
    } catch (err) {
        console.error(err) 
        res.status(500).send()
    }

    if(!user) {
        return res.status(401).send('Unknown user or password')
    }

    try {
        if(await bcrypt.compare(req.user.password, user.password)) {
            const loginResponse = await prepareLoginRespose(user)
            res.json(loginResponse)
            return
        }
        else {
            res.send(401).send('Unknown user or password')
        }
      } catch (err) {
          console.error(err);         
          res.status(500).send()
      }
})

router.post('/refreshtoken', async (req, res) => {
    const reqRefreshToken = req.body.refreshToken
    if (reqRefreshToken == null) 
        return res.sendStatus(401)

    try {
        if(!await dataLayer.refreshTokenExists(reqRefreshToken))
            return res.sendStatus(403)
    }
    catch(err) {
        console.error(err);
        res.status(500).send()
    }

    jwt.verify(reqRefreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) 
        return res.sendStatus(403)

      const accessToken = createJwt(user)
      res.json({ accessToken: accessToken })
    })
  })
  
async function prepareLoginRespose(user) {
    const accessToken = createJwt(user)
    const refreshToken = jwt.sign({id:user.id, email:user.email}, process.env.REFRESH_TOKEN_SECRET)

    let rt = new RefreshToken(refreshToken)
    await dataLayer.createRefreshToken(rt)

    return { email: user.email, accessToken: accessToken, refreshToken: refreshToken}
}

function createJwt(user) {
    return jwt.sign({id:user.id, email:user.email}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_EXPIRATION || '10m' })
}

function processUserData(req, res, next) {
    const user = new User(req.body.email, req.body.password)
    var errors = user.validate()

    if(errors.length != 0) {
        return res.status(400).json(errors)
    }

    req.user = user

    next()
}

module.exports = router