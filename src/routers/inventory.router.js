const router = require('express').Router()
const { authorized } = require('../middlewares')
const inventoryController = require('../controllers/inventory.controller')

router.post('/addStock', authorized, inventoryController.addStockToInventory)

module.exports = router