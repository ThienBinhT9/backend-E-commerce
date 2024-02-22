const { ProductModel } = require('../product.model')

const getProducts = async({query, select, page = 1}) => {

    let limit = 20
    let skip = (page - 1) * limit

    const products = await ProductModel.find(query)
    .populate('product_userId', '_id username email avatar')
    .skip(skip)
    .limit(limit)
    .sort({createdAt:-1})
    .select(select)
    .lean()

    return products
}

const getProductById = async(product_id) => {
    return await ProductModel.findById(product_id).lean()
}

const checkProductByServer = async(products = []) => {
    try {
        return await products.map(async(product) => {
            const foundProduct = await getProductById(product.product_id)
            if(foundProduct){
                return {
                    product_price:foundProduct.product_price,
                    product_id:product.product_id,
                    quantity:product.quantity
                }
            }
        })
    } catch (error) {
        return error.message
    }
}

module.exports = {
    getProducts,
    getProductById,
    checkProductByServer
}