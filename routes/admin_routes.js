const mongoose =require("mongoose")
const express=require("express")

const auth_controller=require("./../controller/auth_controller")
const { check, validationResult } = require('express-validator');
const auth=require("./../auth/auth")
const Product=require('../models/product')
const User=require('../models/user')
const fs=require('fs')

const routes=express.Router()


routes.get('/admin_panel',auth.isAuth ,async(req,res)=>{
    let products=await Product.find({userId: req.session.user})
    res.render('./admin_panel.ejs',{isLogged: req.session.isLogged,products: products})
})

routes.get('/addProduct',auth.isAuth,(req,res)=>{

    res.render('./addProduct.ejs',{errorMessage:null,isLogged: req.session.isLogged})
})

routes.post('/addProduct',auth.isAuth,[
    check('name').isLength({min:3}),
    check('price').isNumeric().withMessage("Price must be a number"),
    check('description').isLength({min: 10}).withMessage("The description is to short")],auth_controller.addProduct)

routes.get('/updateProduct/:id',auth.isAuth ,async(req,res)=>{
    let id=req.params.id
    let product=await Product.findOne({_id: id})

    res.render('./updateProduct.ejs',{isLogged: req.session.isLogged,product: product})
})

routes.post('/admin_panel',auth.isAuth ,async(req,res)=>{
  
    let product=await Product.updateOne({_id: req.body.id},{ $set: {         
        title: req.body.title,
        price: req.body.price,
        imageUrl: req.body.imageUrl,
        description: req.body.description
       } })

   
    res.redirect('admin_panel')
})

routes.post('/deleteProduct/:id',auth.isAuth ,async(req,res)=>{

    let id=req.params.id
    let productImagePath=await Product.findById({_id: id})
    let product=await Product.findByIdAndRemove({_id: id})
    fs.unlink(productImagePath.imageUrl,(err,clb)=>{
        if(err){
            console.log("Nu s-a sters")
        }
    })

    res.redirect('/admin_panel')
})

routes.post('/deleteItemCheckout/:id',auth.isAuth ,async(req,res)=>{

    let id=req.params.id

    let user=await User.findById(req.session.user)


    let updateCart=user.cart.filter(prod=>{
        return prod.productId.toString()!=id.toString()
    })
    
    user=await User.updateOne({_id: req.session.user},{$set: {cart: updateCart}})
    //let product=await Product.deleteOne({_id: id})


    res.redirect('/checkout')
})

module.exports=routes