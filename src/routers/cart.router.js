const router = require('express').Router()
const {authorized} = require('../middlewares')
const cartController = require('../controllers/cart.controller')

router.post('/addToCart', authorized, cartController.addToCart)

router.post('/updateQuantity', authorized, cartController.updateQuantity)

router.patch('/deleteProduct/:product_id', authorized, cartController.deleteProductCart)

router.get('/', authorized, cartController.getCart)

module.exports = router