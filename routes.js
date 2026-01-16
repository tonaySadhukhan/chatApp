const router=require('express').Router();
const Chat=require('./models/chat');
const Message=require('./models/messages');
const User=require('./models/user');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const {sendMail}=require('./mail');
const token=require('./token');
const user = require('./models/user');
router.get('/',(req,res)=>{
    res.send('API is running...');
});

router.post('/signup',async(req,res)=>{
    const {name,username,email,phone,password}=req.body;
    try{
        const existingUser=await User.findOne({$or:[{username},{email},{phone}]});
        if(existingUser){
            return res.status(400).json({message:'User already exists'});
        }
        let hashedPassword=await bcrypt.hash(password,10);
        const user=new User({name,username,email,phone,password:hashedPassword});
        await user.save();
        res.status(201).json({message:'User registered successfully',user});
    }catch(err){
        res.status(500).json({message:'Error registering user',error:err.message});
    }
});
router.post('/login',async(req,res)=>{
    const {username,password}=req.body;
    console.log(username,password);
    try{
        const user=await User.findOne({username});
        if(!user){
            return res.status(400).json({message:'Invalid credentials'});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:'Invalid credentials'});
        }
        const token = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
        res.status(200).json({message:'Login successful',user,token});
    }catch(err){
        res.status(500).json({message:'Error logging in',error:err.message});
    }
});

router.get('/username/:username',token,async(req,res)=>{
    try{
        console.log(req.params.username);
        const username=req.params.username;
         const user = await User.findOne({
  $or: [
    { username: username },
    { phone: username }
  ]
});
        if(user){
            let userData={
                id:user._id,
                name:user.name,
                username:user.username,
                avatar:user.avatar,
                status:user.status,
                email:user.email
            }
            console.log(user);
            return res.status(200).json(userData);
        }else{
            return res.status(200).json({message:'User not found'});
        }
    }catch(err){
        res.status(500).json({message:'Error fetching users',error:err.message});
    }
});

router.post('/send-otp',async(req,res)=>{
    const {email,otp}=req.body;
    console.log(email,otp);
    try{
        await sendMail(email,otp);
        res.status(200).json({message:'OTP sent successfully'});
    }catch(err){
        res.status(500).json({message:'Error sending OTP',error:err.message});
    }
});

router.post('/create-chat', token, async (req, res) => {
  const { participants } = req.body;

  try {
    // 1️⃣ Find users by username
    const users = await User.find({
      username: { $in: participants }
    }).select('_id username');

    if (users.length !== participants.length) {
      return res.status(404).json({
        message: 'One or more users not found'
      });
    }

    // 2️⃣ Extract ObjectIds
    const participantIds = users.map(u => u._id);

    // 3️⃣ Stable roomId
    const roomId = participantIds
      .map(id => id.toString())
      .sort()
      .join('_');

    // 4️⃣ Prevent duplicate 1-to-1 chat
    const existingChat = await Chat.findOne({
      participants: { $all: participantIds, $size: participantIds.length }
    });

    if (existingChat) {
      return res.status(200).json({
        message: 'Chat already exists',
        chat: existingChat
      });
    }

    // 5️⃣ Create new chat
    const chat = new Chat({
      participants: participantIds,
      roomId
    });

    await chat.save();

    // 6️⃣ Push chat to users
    await User.updateMany(
      { _id: { $in: participantIds } },
      { $push: { chats: chat._id } }
    );

    res.status(201).json({
      message: 'Chat created successfully',
      chat
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Error creating chat',
      error: err.message
    });
  }
});

router.get('/mychats/:userId',token,async(req,res)=>{
    try{
        const chats=await user.findOne({username:req.params.userId}).populate('chats');
        console.log(chats);
        res.status(200).json({chats:chats.chats});
    }catch(err){
        res.status(500).json({message:'Error fetching chats',error:err.message});
    }
});

router.get('/user/:id',token,async(req,res)=>{
    try{
        const userData=await User.findById(req.params.id);
        console.log(userData);
        res.status(200).json({user:userData});
    }catch(err){
        res.status(500).json({message:'Error fetching user data',error:err.message});
    }
});

router.get('/messages/:chatId',token,async(req,res)=>{
    try{
        const messages=await Message.find({chatId:req.params.chatId});
        res.status(200).json({messages});
    }catch(err){
        res.status(500).json({message:'Error fetching messages',error:err.message});
    }
});


module.exports=router;

