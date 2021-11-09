const express = require('express')
const router = express.Router()

// post
router.post('/register', async (req, res) =>  {
    const subscriber = new Subscriber({
        name: req.body.name,
        subscribedToChannel: req.body.subscribedToChannel
    })
    try {
        const newSubscribers = await subscriber.save()
        res.status(201).json(newSubscribers)
    }
    catch (err) {
        res.status(400).json({message: err.message})
    }
})