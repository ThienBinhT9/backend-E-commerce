const cartModel = require('../models/cart.model')
const { ProductModel } = require('../models/product.model')

class CartService{

    async createCart({userId, product}){
        const query = {cart_userId:userId},
        updateOrInsert = {
            $addToSet:{ cart_products:product },
            $inc:{
                cart_count_products:1
            }
        },
        options = {upsert:true, new:true}

        return await cartModel.findOneAndUpdate(query, updateOrInsert, options).lean()
    }

    async UpdateQuantity({userId, product}){
        const query = {
            cart_userId:userId, 
            cart_products:{ $elemMatch:{ product_id: product.product_id }}
        },
        options = {upsert:true, new:true}

        return await cartModel.findOneAndUpdate(query, {
            $inc:{
                'cart_products.$.quantity':product.quantity
            }
        }, options).lean()
    }
    
    async addToCart({userId, product}){
        try {
            const foundCart = await cartModel.findOne({cart_userId:userId}).lean()
            const foundProductCart = await cartModel.find({cart_userId:userId, cart_products:{$elemMatch:{product_id:product.product_id}}}).lean()
            
            if(foundCart && foundProductCart){
                const cart = await this.UpdateQuantity({userId, product})
                return {
                    code:201,
                    metadata:cart
                }
            }

            const cart = await this.createCart({userId, product})
            return {
                code:201,
                metadata:cart
            }

        } catch (error) {
            return {
                code:500,
                message:error.message
            }
        }
    }

    async UpdateQuantityV2({userId, product}){
        try {
            const { product_id, old_quantity, quantity, product_userId } = product
            
            const foundProduct = await ProductModel.findOne({
                _id:product_id,
                isPublished:true
            }).lean()
            if(!foundProduct) return {code:404, message:'NotFound product'}

            if(foundProduct.product_userId !== product_userId){
                return {code:401, message:'Shop không đúng!'}
            }

            if(quantity === 0){
                await this.deleteProductCart({userId, product_id})
            }

            const cart = await this.UpdateQuantity({
                userId,
                product:{
                    product_id,
                    quantity:quantity - old_quantity
                }
            })

            return {code:201, metadata:cart}
            
        } catch (error) {
            return {
                code:500,
                message:error.message
            }
        }
    }

    async deleteProductCart({userId, product_id}){
        try {
            const query = {cart_userId:userId},
            updateOrInsert = {
                $pull:{
                    cart_products:{ product_id }
                }
            },
            options = {new:true}

            return {
                code:201,
                metadata: await cartModel.findOneAndUpdate(query, updateOrInsert, options)
            }
            
        } catch (error) {
            return {
                code:500,
                message:error.message
            }
        }
    }

    async getListCart({cart_userId}){
        try {
            return {
                code:201,
                metadata: await cartModel.findOne({cart_userId})
                .populate('')
                .lean()
            }
        } catch (error) {
            return {
                code:500,
                message:error.message
            }
        }
    }
}

module.exports = new CartService