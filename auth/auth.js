const Product=require("./../models/product")

exports.isAuth= async(req,res,next)=>{
    
    if(req.session.isLogged!==true){ 
        res.redirect('/')}
    else
     next()
}