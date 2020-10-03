const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://Jameson:xmx1510.26@cluster0.7sg8v.mongodb.net/Icloud", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
}).then(() => console.log('Mongodb conneted!'))