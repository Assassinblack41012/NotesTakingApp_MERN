const { Router } = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const {UserModel} = require("../models/User.model") 

const userController = Router()

// signup api to send user data in database
userController.post("/signup", async (req, res) => {
    const { email, password, age } = req.body

    const isUser = await UserModel.findOne({ email })
    if(isUser) {
        res.send({"msg" : "user already exits please login"})
    } else {
        bcrypt.hash(password, 5, async function(err, hash) {
            if(err) {
                res.send("sometning went wrong, plz try again later")
            } 
            else {
                const user = new UserModel({    
                    email,
                    password: hash,
                    age
                })
                try {          
                    await user.save()
                    res.status(200).send({msg: "signUp Successful"})
                } catch (err) {
                    console.log(err)
                    res.send("something went wrong, plz try again", err)
                }
            }

        });
    }

})

// login api 
userController.post("/login", async (req, res) => {
    const { email, password } = req.body

    const user = await UserModel.findOne({email})
    const hash = user.password
    bcrypt.compare(password, hash, function(err, result) {
        if(err) {
            res.send("sometning went wrong, plz try again later")
        }
        if(result) {
            const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET)
            res.json({message: "Login successful", token})
        } else {
            res.send("Invalid crdential")
        }
    });
})

module.exports = { userController }