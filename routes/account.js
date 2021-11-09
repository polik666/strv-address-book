const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const router = express.Router()

const User = require('../models/user')
const RefreshToken = require('../models/refresh-token')

router.get('/echo', async (req, res) => {
    try {
        const allUsers = await User.find();
        res.send(allUsers);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message })
    }
}) 

router.post('/register', validateUserData, async (req, res) =>  {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = new User({ email: req.body.email, password: hashedPassword })
        user.save();
        const loginResponse = await prepareLoginRespose(user)
        res.json(loginResponse)
    } catch (err) {
        console.error(err);    
        res.status(500).send()
    }
})

router.post('/login', validateUserData, async (req, res) =>  {
    let user = null
    try {
        user = await User.findOne(u => {email = req.body.email}).clone()
    } catch (err) {
        console.error(err);    
        res.status(500).send()
        return
    }
    
    if(!user) {
        return res.status(401).send('Unknown user or password')
    }
    try {
        if(await bcrypt.compare(req.body.password, user.password)) {
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

async function prepareLoginRespose(user) {
    const accessToken = createJwt(user.email)
    const refreshToken = jwt.sign(user.email, process.env.REFRESH_TOKEN_SECRET)

    let rt = new RefreshToken({ token: refreshToken })
    await rt.save()

    return { email: user.email, accessToken: accessToken, refreshToken: refreshToken}
}

router.post('/refreshtoken', async (req, res) => {
    const reqRefreshToken = req.body.refreshToken
    if (reqRefreshToken == null) 
        return res.sendStatus(401)

    try {
        if(!await RefreshToken.exists({token: reqRefreshToken}))
            return res.sendStatus(403)
    }
    catch(err) {
        console.error(err);
        res.status(500).send()
    }

    jwt.verify(reqRefreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) 
        return res.sendStatus(403)

      const accessToken = createJwt(user.email)
      res.json({ accessToken: accessToken })
    })
  })

function createJwt(email) {
    return jwt.sign({email:email}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' })
}

function validateUserData(req, res, next) {
    const errors = []
    if(!req.body.email){
        errors.push('Email')
    }
    if(!req.body.password) {
        errors.push('Password')
    }

    if(errors.length > 0) {
        return res.status(400).json({message: 'Missing required fields', fields: errors})
    }
    next()
}

module.exports = router