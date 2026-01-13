const mongoose=require('mongoose');
require('dotenv').config();
const chatschema=new mongoose.Schema({
    participants: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
],
    roomId:{
        type:String,
        required:true,
        unique:true
    },
    messages:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'Message',
        default:[]
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});
module.exports=mongoose.model('Chat',chatschema);