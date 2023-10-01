const express = require('express');

const router = express.Router();

// import controllers
const {  getAllProducts , getSingleProduct , createProduct , updateProduct , deleteProduct} = require("../controllers/products.controller")

const { body } = require('express-validator')

const verifyToken = require('../middleware/verifyToken');

const { ADMIN , MANAGER} = require("../utils/roles");

const allowedTo = require("../middleware/allowedTo")

router.route('/')
      .get(getAllProducts)
      .post(
            verifyToken , allowedTo(ADMIN, MANAGER) ,
            body('title').notEmpty().withMessage("title is required").isLength({min:2}).withMessage("characters smaller than 2"), 
            body('price').notEmpty().withMessage('price is required'),
            body('description').notEmpty().withMessage('description is required').isLength({min:10}).withMessage("characters smaller than 10"),
            createProduct
        )

router.route('/:productId')
      .get(getSingleProduct)
      .patch(updateProduct)
      .delete(verifyToken , allowedTo(ADMIN, MANAGER) ,deleteProduct)

module.exports = router