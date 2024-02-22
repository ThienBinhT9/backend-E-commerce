
const inventoryModel = require('../models/inventory.model')
const { ProductModel } = require('../models/product.model')

class InventoryService{
    
    async addStockToInventory({productId, stock, userId, location = 'Nhà số 12, Khu phố mới Tiến Bào, Phường Phù Khê, Thành phố Từ Sơn, Tỉnh Bắc Ninh'}){
        try {
            const foundProduct = await ProductModel.findById(productId).lean()
            if(foundProduct) return {code:404, message:'NotFound product'}

            if(foundProduct.product_userId !== userId){
                return {code:401, message:'Bạn không có quyền!'}
            }

            const newInven = await inventoryModel.findOneAndUpdate({
                inventory_userId:userId,
                inventory_productId:productId
            },{
                $inc:{
                    inventory_stock:stock
                },
                $set:{
                    inventory_location:location
                }
            }, {upsert:true, new:true})

            return {
                code:201,
                metadata:newInven
            }

        } catch (error) {
            return {
                code:500,
                message:error.message
            }
        }
    }
    
}

module.exports = new InventoryService