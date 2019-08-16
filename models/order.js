const mongoose =require("mongoose")

const orderSchema= new mongoose.Schema({

   products:[{
       productId: {type: mongoose.Schema.Types.ObjectId,required: true },
       quantity: {type: Number,required: true }
   }],
   user:{
       id: {type: mongoose.Schema.Types.ObjectId,required: true }
   }
})

const order=mongoose.model("Order",orderSchema)
module.exports=order