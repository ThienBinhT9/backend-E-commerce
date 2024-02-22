const authRouter = require('./auth.router')
const productRouter = require('./product.router')
const userRouter = require('./user.router')
const discountRouter = require('./discount.router')
const cartRouter = require('./cart.router')
const checkoutRouter = require('./checkout.router')
const inventoryRouter = require('./inventory.router')
const commentRouter = require('./comment.router')

const routers = (app) => {

    app.use('/product', productRouter)

    app.use('/user', userRouter)

    app.use('discount', discountRouter)

    app.use('/cart', cartRouter)
    
    app.use('/checkout', checkoutRouter)

    app.use('/inventory', inventoryRouter)

    app.use('/comment', commentRouter)

    app.use('/auth', authRouter)

}

module.exports = routers
