const mongodb=require("mongodb")


const MongoClient = mongodb.MongoClient

MongoClient.connect('mongodb+srv:ghita:9vImhxfuY8vqZjwc@cluster0-wcfmd.mongodb.net/test?retryWrites=true&w=majority')
           .then(()=> console.log('Succes'))
           .catch((err)=> console.log(err))