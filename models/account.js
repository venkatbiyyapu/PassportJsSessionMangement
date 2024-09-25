var mongoose = require('mongoose'),
Schema = mongoose.Schema,
passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: {
      type: String,
      required: true,
      unique:true
    },
    email: {
      type: String,
      required: true,
      unique:true
    },
    phone:{
        type:String,
        required:true
    },
    address:{
        type: String,
        required: true,
    },
  });

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
