const checkoutService = require('../services/checkout.service')

class CheckoutController{

    async review(req, res) {
        try {
            const data = {
                ...req.body,
                userId:req.user_id
            }
            return res.status(200).json(await checkoutService.review(data))
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    async orderByUser(req, res){
        try {
            const data = {
                ...req.body,
                userId:req.user_id
            }
            return res.status(200).json(await checkoutService.orderByUser(data))
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
}

module.exports = new CheckoutController
