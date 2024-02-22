const router = require('express').Router()
const { authorized } = require('../middlewares')
const ProductController = require('../controllers/product.controller')

router.post('/create', authorized, ProductController.createProduct)

router.get('/drafts/all', authorized, ProductController.findAllDarftsForShop)

router.get('/published/all/:product_userId', ProductController.findAllPublishedOfShop)

router.get('/all', ProductController.findAllProducts)

router.get('/detail/:product_id', ProductController.findOneDetailProduct)

router.get('/search', ProductController.searchProduct)

router.patch('/publish/:product_id', authorized, ProductController.publishProductByShop)

router.patch('/unPublish/:product_id', authorized, ProductController.unPublishProductByShop)

router.patch('/update/:product_id', authorized, ProductController.updateProductByShop)

module.exports = router
