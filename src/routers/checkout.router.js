const router = require('express').Router()
const { authorized } = require('../middlewares')
const CheckoutController = require('../controllers/checkout.controller')

router.post('/review', authorized, CheckoutController.review)

router.post('/orderByUser', authorized, CheckoutController.orderByUser)

module.exports = router