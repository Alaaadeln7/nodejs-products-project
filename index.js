// start to use dotenv package
require('dotenv').config();
// end to use dotenv package 
const express = require('express');
const app = express();
const {SUCCESS , FAILD , ERROR} = require('./utils/httpStatusText');

// start mongoose section  
const mongoose = require('mongoose');
const url = process.env.DATABASE_URL;
mongoose.connect(url).then(() => {
console.log('mongoDB connected successfuly');
})
// end mongoose section 
app.use(express.json())

const productsRouter = require('./routes/products.route');
const usersRouter = require('./routes/users.route')
app.use('/api/products' , productsRouter )

app.use('/api/users' , usersRouter )

// start use static upload folder

const path = require('path')
app.use('/uploads', express.static(path.join(__dirname , 'uploads')))

// end use static upload folder


app.all('*' , (req , res , next) => {
  return res.status(404).json({status: ERROR , message: 'this resource is not available'})
})


app.use((error,req ,res , next)=>{
  res.status(error.statusCode || 500).json({status: error.statusText || ERROR , message : error.message , code : error.statusCode || 500 , data: null})
})


app.listen(process.env.PORT || 4000 , () => {
  console.log('app run in http://localhost:'+process.env.PORT);
})