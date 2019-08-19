const express=require('express')
const path=require('path')
const fs=require('fs')
const mongodb=require("mongodb")
const mongoose= require("mongoose")
const bodyParser=require('body-parser')
const session=require("express-session")
const multer=require("multer")
const uuid=require('uuid/v4')
const helmet=require('helmet')
const compression=require('compression')
const morgan=require('morgan')

const app=express()
const PORT=3000

const routes=require("./routes/route")
const auth_routes=require("./routes/auth_route")
const admin_routes=require("./routes/admin_routes")
const User=require("./models/user")

const accesFile=fs.createWriteStream(path.join(__dirname,'access.log'),{flags: 'a'});

app.use(helmet())
app.use(compression())
app.use(morgan('combined',{stream: accesFile}))
app.set("view engine","ejs")
app.set("views","views")


app.use('/updateProduct/:id',express.static(path.join(__dirname,'public')))
app.use('/item/:id',express.static(path.join(__dirname,'public')))
app.use('/images',express.static(path.join(__dirname,'images')))
app.use('/typo',express.static(path.join(__dirname,'public')))
app.use('/typo/images',express.static(path.join(__dirname,'images')))
app.use(express.static(path.join(__dirname,'public')))


const fileStorage=multer.diskStorage({ 
    destination: (req,file,callback)=>{ callback(null,'images')},
    filename: (req,file,callback)=>{callback(null,uuid()+'-'+file.originalname)}
})

const fileFilter=(req,file,callback)=>{

   if(file.mimetype==='image/jpg'|| file.mimetype==='image/png'|| file.mimetype==='image/jpeg'){
   callback(null,true)}
   else{ 
   callback(null,false)}
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(multer({storage: fileStorage,fileFilter:fileFilter}).single('images'))
app.use(session({
    secret: "My secret",
    saveUninitialized: false,
    resave:true,
    cookie:{expires: 60000*60 }
}))

app.use('/',admin_routes)
app.use('/',auth_routes)
app.use('/',routes)


app.use('*',(req,res,next)=>{
    res.render('404.ejs',{isLogged: req.session.isLogged})
})



mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-wcfmd.mongodb.net/${process.env.MONGO_NAME}`, {useNewUrlParser: true})
        .then(async ()=>{ 
            
            console.log("Database connection established")
            app.listen(process.env.PORT||3000,()=>console.log(`Server starts on port ${PORT}`))}
            
        )
        .catch((err)=> console.log(err))

module.exports=app