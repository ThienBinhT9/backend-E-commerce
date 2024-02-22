const cartService = require('../services/cart.service')

class CartController{
    
    async addToCart(req, res){
        try {
            return res.status(200).json(await cartService.addToCart({userId:req.user_id, product:req.body}))
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    async updateQuantity(req, res) {
        try {
            const {product, version} = req.body
            return res.status(200).json(await cartService.UpdateQuantityV2({userId:req.user_id, product}))
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    async deleteProductCart(req, res) {
        try {
            const { product_id } = req.params
            return res.status(200).json(await cartService.deleteProductCart({userId:req.user_id, product_id}))
        } catch (error) {
            return res.status(500).json(error.message)
            
        }
    }

    async getCart(req, res) {
        try {
            return res.status(200).json(await cartService.getListCart({cart_userId:req.user_id}))
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }


}

module.exports = new CartController
