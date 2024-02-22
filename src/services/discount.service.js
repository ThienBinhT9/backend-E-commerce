const DiscountModel = require('../models/discount.model')
const { findDiscountByCodeOfShop } = require('../models/repo/discount.repo')
const {getProducts} = require('../models/repo/product.repo')

class DiscountService{
 
    async create(body){
        try {
            const { discount_code, discount_start_date, discount_end_date, discount_userId } = body

            const foundDiscountByCode = await findDiscountByCodeOfShop({discount_code, discount_userId})
            if(foundDiscountByCode && foundDiscountByCode.discount_is_active === true){
                return {
                    code:401,
                    message:'Discount code này đã tồn tại!'
                }
            }

            if(new Date(discount_start_date) > new Date(discount_end_date) || new Date() > new Date(discount_start_date)){
                return {
                    code:401,
                    message:'Tạo discount thất bại!'
                }
            }

            const newDiscount = await DiscountModel.create(body)
            return {
                code:201,
                metadata:newDiscount
            }
        } catch (error) {
            return {
                code:500,
                message:error.message
            }
        }
    }

    async getDiscountByShop({discount_userId}){
        try {
            const discounts = await DiscountModel.find({
                discount_is_active:true,
                discount_userId
            })
            .sort({createdAt:-1})
            .lean()

            return {
                code:201,
                metadata:discounts
            }
        } catch (error) {
            return {
                code:500,
                message:error.message
            }
        }
    }

    async getDiscountOfShopByUser({discount_userId}){
        try {
            const discounts = await DiscountModel.find({
                discount_is_active:true,
                discount_end_date:{$gt: new Date()},
                discount_start_date:{$lt: new Date()},
                discount_userId,
                discount_max_use:{$gte:0}
            })

            return {
                code:201,
                metadata:discounts
            }
        } catch (error) {
            return {
                code:500,
                message:error.message
            }
        }
    }

    async getProductFitWithDiscountOfShop({discount_id, page = 1}){
        try {
            const discount = await DiscountModel.findOne({
                _id:discount_id,
                discount_is_active:true
            })
            if(!discount) return {code:401, message:'NotFound discount'}

            const select = 'product_name product_thumb product_price _id'
            let query = { product_userId:discount.discount_userId, isPublished:true }

            if(discount.discount_apply_to === 'specific'){
                query._id = {$in:discount.discount_product_ids}
            }
            const products = await getProducts({query, select, page})

            return {
                code:201,
                metadata:products
            }
            
        } catch (error) {
            return {
                code:500,
                message:error.message
            }
        }
    }

    async getAmountDiscount({discount_id, userId, products = []}){
        try {
            const discount = await DiscountModel.findOne({
                _id:discount_id,
                discount_userId:userId
            })
            if(!discount) return {code:404, message:'NotFound discount!'}

            const { 
                discount_is_active, discount_max_use, discount_end_date,
                discount_start_date, discount_min_order_value, discount_type,
                discount_max_use_per_user, discount_value, discount_users_used
            } = discount

            if(!discount_is_active) return {code:401, message:'Discount inactive!'}
            if(!discount_max_use) return {code:401, message:'Discount đã hết lượt sử dụng!'}
            if(new Date() > new Date(discount_end_date) || new Date() < new Date(discount_start_date)){
                return { code:401, message:'Hạn sử dụng discount không hợp lệ!'}
            }

            let totalOrder = products.reduce((prev, current_product) => {
                return prev + (current_product.product_price * current_product.quantity)
            },0)
            if(discount_min_order_value > totalOrder){
                return {code:401, message:'Giá tiền của đơn hàng chưa đủ để áp dụng discount này!'}
            }

            const userUseDiscount = discount_users_used.find(item => item?.userId === userId)
            if(Number(userUseDiscount?.used) >= discount_max_use_per_user){
                return {code:401, message:'Số lần sử dụng discount đã hết'}
            }

            const amount = discount_type === 'fixed' ? discount_value : Number(totalOrder * (discount_value / 100)).toFixed(4)

            return {
                totalOrder,
                discount:amount,
                totalPrice:totalOrder - amount
            }

        } catch (error) {
            return {
                code:500,
                message:error.message
            }
        }
    }

    async updateDiscount(){
        try {
            
        } catch (error) {
            return {
                code:500,
                message:error.message
            }
        }
    }

    async deleteDiscount({discount_id, userId}){
        try {
            const discount = await DiscountModel.findOne({
                _id:discount_id,
                discount_userId:userId
            }).lean()
            if(!discount) return {code:404, message:'NotFound discount'}

            if(discount.discount_userId !== userId) return {code:401, message:'Bạn không có quyền!'}

            const { deletedCount } = await DiscountModel.deleteOne({
                _id:discount_id, 
                discount_userId:userId
            })

            if(deletedCount) return {code:201, metadata:'Delete discount successfully!'}
            if(!deletedCount) return {code:401, message:'Delete discount failed!'}
            
        } catch (error) {
            return {
                code:500,
                message:error.message
            }
        }
    }

}

module.exports = new DiscountService
