const cartModel = require('../models/cart.model')
const orderModel = require('../models/order.model')
const { getAmountDiscount } = require('../services/discount.service')
const { checkProductByServer } = require('../models/repo/product.repo')
const { acquireLock, releaseLock } = require('../services/redis.service')

class CheckoutService{

    /*
        cartId,
        userId,
        shop_order_ids = [
            {
                userId,
                discounts,
                products = [
                    {
                        product_id,
                        product_price,
                        quantity
                    },
                    {
                        product_id,
                        product_price,
                        quantity
                    },
                ]
            },
            {
                userId,
                discounts,
                products = [
                    {
                        product_id,
                        product_price,
                        quantity
                    },
                    {
                        product_id,
                        product_price,
                        quantity
                    },
                ]
            },
        ]
    */
    
    async review({cartId, userId, shop_order_ids = []}){
        try {
            const foundCart = await cartModel.findById(cartId).lean()
            if(!foundCart) return {code:404, message:'NotFound cart!'}

            const checkout_order = {
                totalOrder:0,
                feeShip:0,
                totalDiscount:0,
                totalPayment:0
            }, shop_order_ids_new = []
 
            shop_order_ids.forEach(async(order) => {
                const {products = [], discounts = []} = order

                //Kiểm tra giá sản phẩm với database
                const productsChecked = await checkProductByServer(products)
                if(!productsChecked[0]) return {code:401, message:'Order wrong!!'}

                //Tính tổng tiền order
                const totalOrder = productsChecked.reducer((prev, currentProduct) => {
                    return prev + (currentProduct.quantity * currentProduct.product_price)
                }, 0)

                checkout_order.totalOrder += totalOrder

                const itemCheckout = {
                    userId:order.userId,
                    discounts,
                    products:productsChecked,
                    priceRaw:totalOrder,
                    priceApplyDiscount:totalOrder
                }

                //Nếu có áp dụng discount ở đơn hàng thì lấy số tiền giảm giá
                if(discounts.length > 0){
                    discounts.forEach(async(discount_id) => {
                        //get amount discount
                        const { discount = 0 } = await getAmountDiscount({discount_id, userId, products:productsChecked})

                        checkout_order.totalDiscount += discount

                        //Nếu tiền giảm giá lớn hơn 0
                        if(discount > 0){
                            itemCheckout.priceApplyDiscount += totalOrder - discount
                        }
                    })
                }

                //Tổng thanh toán cuối cùng
                checkout_order.totalPayment += itemCheckout.priceApplyDiscount
                shop_order_ids_new.push(itemCheckout)
            })

            return {
                code:201,
                metadata:{
                    shop_order_ids,
                    shop_order_ids_new,
                    checkout_order
                }
            }
        } catch (error) {
            return {
                code:500,
                message:error.message
            }
        }
    }

    async orderByUser({cartId, userId, shop_order_ids, user_address, user_payment}){
        try {
            const { shop_order_ids_new = [], checkout_order} = await this.review({cartId, userId, shop_order_ids})

            const products = shop_order_ids_new.flatMap(order => order.products)
            const acquireProduct = []
            products?.forEach(async(product) => {
                const {product_id, quantity} = product

                const keyLock = await acquireLock({product_id, cartId, quantity})
                acquireProduct.push(keyLock ? true : false)
                if(keyLock){
                    await releaseLock(keyLock)
                }
            })

            if(acquireProduct.includes(false)){
                return {
                    code:401,
                    message:'Một số sản phẩm đã được cập nhật. Vui lòng vào lại giỏ hàng!'
                }
            }

            const newOrder = await orderModel.create({
                order_userId:userId,
                order_checkout:checkout_order,
                order_shipping:user_address,
                order_payment:user_payment,
                order_products:shop_order_ids_new,
            })

            //Nếu order thành công thì xóa sản phẩm trong giỏ hàng
            if(newOrder){
                
            }

            return {
                code:201,
                metadata:newOrder
            }
        } catch (error) {
            return {
                code:500,
                message:error.message
            }
        }
    }

    async getOrderByUser(){
        try {
            
        } catch (error) {
            return {
                code:500,
                message:error.message
            }
        }
    }

    async cancelOrderByUser(){
        try {
            
        } catch (error) {
            return {
                code:500,
                message:error.message
            }
        }
    }

    async updateStatusOrderByShop(){
        try {
            
        } catch (error) {
            return {
                code:500,
                message:error.message
            }
        }
    }
}

module.exports = new CheckoutService