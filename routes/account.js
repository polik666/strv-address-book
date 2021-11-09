const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()

const users = []

router.get('/echo', (req, res) => {
    res.send(users);
}) 

router.post('/register', async (req, res) =>  {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = { name: req.body.name, password: hashedPassword }
        users.push(user)
        res.status(200).send()
    } catch (err) {
        console.error(err);    
        res.status(500).send()
      }
})

router.post('/login', async (req, res) =>  {
    const user = users.find(u => u.name === req.body.name)
    if(!user) {
        return res.status(401).send('Unknown user or password')
    }
    try {
        if(await bcrypt.compare(req.body.password, user.password)) {
            res.status(200)
        }
        else {
            res.send(401).send('Unknown user or password')
        }
      } catch (err) {
          console.error(err);         
          res.status(500).send()
      }
})

module.exports = router