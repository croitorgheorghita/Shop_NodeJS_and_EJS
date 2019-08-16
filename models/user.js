const mongoose =require("mongoose")

const userSchema= new mongoose.Schema({
  
  username: {
      type: String,
      require: true,
  },
  email:{
      type: String,
      required:true,
      unique: true
  },

  password: {
      type:String,
      required: true,
  },

  cart: [{
          productId: {
              type: mongoose.Schema.Types.ObjectId,
              ref:'Product',
              required: true,
          },
          quantity: {
              type: Number,
              required: true
          }
      }]
})
const user=mongoose.model('User', userSchema)

module.exports=user