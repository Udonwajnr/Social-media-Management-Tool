const mongoose = require("mongoose")

const connectDB =async()=>{
    try{
        const databaseName = "SocialMediaManagementTool";
        const options = {
        dbName: databaseName,
        };
        const conn =  await mongoose.connect(process.env.MONGO_URI,options)
        console.log(`MongoDB Connected:${conn.connection.host}`.magenta.bold.underline) 
    }
    catch(error){ 
        console.log(error)
        process.exit(1)
    }
}


module.exports = connectDB