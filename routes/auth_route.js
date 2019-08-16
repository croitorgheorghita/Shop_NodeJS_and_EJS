const mongoose =require("mongoose")
const express=require("express")

const auth_controller=require("./../controller/auth_controller")
const { check, validationResult } = require('express-validator');
const auth=require('./../auth/auth')

const routes=express.Router()


routes.get('/account',(req,res)=>{

    res.render('./account.ejs',{errorMessage:null,isLogged: req.session.isLogged})
})

routes.get('/register',(req,res)=>{

    res.render('./register.ejs',{errorMessage: null,isLogged: req.session.isLogged})
})

routes.post('/account',auth_controller.login)


routes.post('/register',[

    check('email').isEmail(),
    check('password').isLength({min: 5}).withMessage("Password must have at least 5 characters"),
    check('confirmPassword').custom((value, {req})=>{
      if(value!=req.body.password){ 
      throw new Error("Passwords must match!!")}
      return true
    })
],auth_controller.register)

routes.get('/logout',auth_controller.logout)

routes.post('/checkout',auth_controller.addToCart)

routes.post('/clearCart',auth.isAuth,auth_controller.clearCart)

routes.post('/takeOrder',auth.isAuth,auth_controller.takeOrder)
module.exports=routes