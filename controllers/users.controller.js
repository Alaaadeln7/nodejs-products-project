const asyncWrapper = require("../middleware/asyncWrapper");
const User = require("../models/user.model")
const {SUCCESS , FILAD , ERROR} = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const bcrypt = require('bcryptjs');


const getAllUsers = asyncWrapper(async (req,res) => {
    console.log(req.headers);
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit ;
    const users = await User.find({},{"__v": false,'password': false}).limit(limit).skip(skip)
    res.json({status: SUCCESS , data: {users}});
  }
)


// register 

const register = asyncWrapper(
  async (req , res, next) => {
    const {fristName , lastName, email, password , comment , role} = req.body;

    const oldUser = await User.findOne({email: email})

    if (oldUser) {
      const error = appError.create("user already exist", 400 , ERROR)
      return next(error);
    }
    // password hashing
    const hashedPassword = await bcrypt.hash(password , 10)


    const newUser = new User({
      fristName,
      lastName,
      email,
      comment,
      role,
      password: hashedPassword,
      avatar: req.file.fileName
    })
    await newUser.save();
    res.status(201).json({status: SUCCESS , data: {user: newUser}})

  }
)



// login
const login = asyncWrapper(
  async(req ,res ,next) => {
    const {email, password} = req.body;


    if(!email && !password){
      const error = appError.create("email and password are required", 400 , FILAD)
      return next(error);
    }
    const user = await User.findOne({email: email});
    if(!user){
      const error = appError.create("user is not found", 400 , FILAD)
      return next(error);
    }
    const matchedPassword = await bcrypt.compare(password , user.password);
    
    if (user && matchedPassword) {
      res.json({status: SUCCESS , data: { user }});
    }else{
      const error = appError.create("something wrong", 500 , ERROR)
      return next(error);
    }
  }
)



module.exports = {
  getAllUsers , 
  register , 
  login
}