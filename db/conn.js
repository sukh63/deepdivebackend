const mongoose = require('mongoose');
const DB="mongodb+srv://sukh:Sukhg123@cluster0.iotiq.mongodb.net/Test";
console.log(DB)

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    
}).then(() => {
  console.log(`connnection successful`);
}).catch((err) => console.log(`no connection`+err));