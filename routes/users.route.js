const express = require('express');

const router = express.Router();

const multer = require('multer');
const diskStorage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'uploads')
      },
      filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const fileName = `user-${Date.now()}.${ext}`
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null,fileName)
      }
    })

const  fileFilter = (req , file ,cb) => {
  const imageType = file.mimetype.split("/")[0];
  if(imageType === "image"){
    return cb(null , true)
  } else {
    return cb(appError.create("the file must be an image" , 400) , false)
  }
}

const upload = multer({
    storage: diskStorage ,
    fileFilter
  })

// verify token

const verifyToken = require("../middleware/verifyToken");

// import controllers
const {getAllUsers ,register ,login} = require("../controllers/users.controller");

const { body } = require('express-validator');
const appError = require('../utils/appError');


router.route('/')
      .get(verifyToken, getAllUsers)


router.route('/register')
      .post( upload.single('avatar') , register);


router.route('/login')
      .post(login)

module.exports = router