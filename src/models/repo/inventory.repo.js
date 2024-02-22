const InventoryModel = require('../inventory.model')

const createInventory = async({userId, productId, location = 'unKnow', stock}) => {
    try {
        return await InventoryModel.create({
            inventory_userId:userId,
            inventory_productId:productId,
            inventory_location:location,
            inventory_stock:stock
        })
    } catch (error) {
        return error.message
    }
}

const reservationInventory = async({productId, quantity, cartId}) => {
    try {
        return await InventoryModel.updateOne({
            inventory_productId:productId,
            inventory_stock:{$gte:quantity}
        },{
            $inc:{
                inventory_stock:-quantity
            },
            $push:{
                inventory_reservations:{
                    quantity,
                    cartId
                }
            }
        })
    } catch (error) {
        return error.message
    }
}

module.exports = {
    createInventory,
    reservationInventory
}