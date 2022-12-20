const mongoose = require("mongoose");
const mongoURI = "mongodb+srv://Beatzz_Admin:Beatzz_123@cluster0.6wgk7.mongodb.net/MusicDB";
const connectToMongo = ()=>{
mongoose.connect(mongoURI, ()=>{
console.log("Connected to Mongo Successfully");
})
}

module.exports = connectToMongo;
