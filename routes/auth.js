const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jwt-then')
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const router = express.Router()

const JWT_SECRET = "Welcome to spotify";

router.post('/signup', [
    body('name').isLength({ min: 3 }),
    body('email').isEmail()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: errors.array() });
    }

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Email already exists", success: false })
        }
        let salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);

        user = await User.create({ name: req.body.name, email: req.body.email, password });
        res.send({ success: true })
    }
    catch (error) {
        res.status(500).send("Internal Serval Error");
    }
})

router.post('/signin', [
    body('email').isEmail()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: errors.array() });
    }

    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password", success: false })
        }
        let isValid = await bcrypt.compare(req.body.password, user.password);
        if(!isValid){
            return res.status(400).json({ error: "Invalid email or password", success: false })
        }
        const data = {
            user: {
                id: user._id
            }
        };

        const authtoken = await jwt.sign(data, JWT_SECRET);

        res.json({success : true, authtoken,user});
        
    }
    catch (error) {
        res.status(500).send("Internal Serval Error");
    }
})

router.post('/resetpassword', [
        body('email').isEmail()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: errors.array() });
    }

    try {
        let user
         = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ error: "Email Not Found", success: false })
        }
        let salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);

        user = await User.update({password});
        res.send({ success: true })
    }
    catch (error) {
        res.status(500).send("Internal Serval Error");
    }
})

module.exports = router;