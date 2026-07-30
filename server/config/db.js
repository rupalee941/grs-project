const mongoose = require("mongoose")

const mongoDB = () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("Database connected");

    }).catch((er) => {
        console.log(er)
        console.log("Database not connected")
  })
}
module.exports = mongoDB;