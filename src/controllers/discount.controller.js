const discountService = require('../services/discount.service')

class DiscountController{

    async create(req, res){
        try {
            const body = {
                ...req.body,
                discount_userId:req.user_id
            }
            
            return res.status(200).json(await discountService.create(body))
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    async getDiscountByShop(req, res) {
        try {
            return res.status(200).json(await discountService.getDiscountByShop({discount_userId:req.user_id}))
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
    
    async getDiscountOfShopByUser(req, res) {
        try {
            const { discount_userId } = req.params
            return res.status(200).json(await discountService.getDiscountOfShopByUser({discount_userId}))
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    async getProductFitWithDiscountOfShop(req, res){
        try {
            const { page } = req.query
            const { discount_id } = req.params
            return res.status(200).json(await discountService.getProductFitWithDiscountOfShop({discount_id, page}))
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    async getAmountDiscount(req, res) {
        try {
            const { discount_id, products } = req.body
            return res.status(200).json(await discountService.getAmountDiscount({userId:req.user_id, products, discount_id}))
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    async deleteDiscount(req, res){
        try {
            const {discount_id} = req.params
            return res.status(200).json(await discountService.deleteDiscount({discount_id, userId:req.user_id})) 
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
}

module.exports = new DiscountController
