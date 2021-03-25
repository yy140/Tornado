var mongoose = require('mongoose')
var bcrypt = require('bcrypt');
 
var Schema = mongoose.Schema;
 
var UserSchema = new Schema({
  username : {
    type: String,
    required: true
  },
  password : {
    type : String,
    required : true
  },
  highScore : {
    type: Number,
    default: 0
  }
});
 
UserSchema.pre('save', async function (next) {
  var user = this;
  var hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});
 
UserSchema.methods.isValidPassword = async function (password) {
  var user = this;
  var compare = await bcrypt.compare(password, user.password);
  return compare;
}
 
User = mongoose.model('user', UserSchema);
 
module.exports = User;