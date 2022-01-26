const router = require("express").Router (); 
const { UserModel } = require("../models");
const { UniqueConstraintError} = require("sequelize/lib/errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
    let { username, passwordhash } = req.body.user;
    try {
        const User = await UserModel.create({
            username, 
            passwordhash: bcrypt.hashSync(passwordhash, 13)
        });

        let token = jwt.sign({id: User.id}, "i_am_secret", {expiresIn: 60 * 60 * 24})

        res.status (201).json({ 
            message: "User successfully registered",
            user: User,
            sessionToken: token
        });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status (409).json({ 
                message: "Username already in use",
            }); 
        } else {
            res.status (500).json({
                message: "Failed to register user",
        });
    }
    }
});

router.post("/login", async (req, res) => { 
    let { username, passwordhash } = req.body.user;

try {
    let loginUser = await UserModel.findOne ({
        where: { 
            username: username,
        }, 
    });

    if (loginUser) {

        let passwordhashComparison = await bcrypt.compare(passwordhash, loginUser.passwordhash);

        if (passwordhashComparison) {

        let token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

        res.status (200).json({ 
            user: loginUser, 
            message: "User successfully logged in!",
            sessionToken: token
        }); 
    } else { 
        res.status (401).json({ 
            message: 'Incorrect username or password'
        })
    }

} else { 
    res.status (401).json({ 
        message: 'Incorrect username or password'
    })
}
} catch (error) {
    res.status (500).json({ 
        message: "Failed to log user in"
    })
}
});

module.exports = router;