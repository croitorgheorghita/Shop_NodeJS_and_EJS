const Product=require("./../models/product")

exports.isAuth= async(req,res,next)=>{
   
    if(req.session.isLogged!==true){ 
    let products=await Product.find()
    res.redirect('/')}
     else
     next()
}