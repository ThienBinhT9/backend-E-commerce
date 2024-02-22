const DiscountModel = require('../discount.model')

const findDiscountByCodeOfShop = async({discount_code, discount_userId}) => {
    return await DiscountModel.findOne({
        discount_userId,
        discount_code,
    }).lean()
}



module.exports = {
    findDiscountByCodeOfShop
}