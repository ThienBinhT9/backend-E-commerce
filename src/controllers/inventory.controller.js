const inventoryService = require('../services/inventoriy.service')

class InventoryController{
    async addStockToInventory(req, res){
        try {
            const data = {
                ...req.body,
                userId:req.user_id
            }
            return res.status(200).json(await inventoryService.addStockToInventory(data))
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
}

module.exports = new InventoryController