const router = require('express').Router()
const discountController = require('../controllers/discount.controller')
const { authorized } = require('../middlewares')

router.post('/', authorized, discountController.create)

router.post('/getAmount', authorized, discountController.getAmountDiscount)

router.get('/mydiscount', authorized, discountController.getDiscountByShop)

router.get('/all/ofShopBy/:discount_userId', discountController.getDiscountOfShopByUser)

router.get('/productFit/all/:discount_id', discountController.getProductFitWithDiscountOfShop)

router.delete('/:discount_id', authorized, discountController.deleteDiscount)

module.exports = router