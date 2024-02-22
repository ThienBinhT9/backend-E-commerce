const { ProductModel, ClothingModel, ElectronicModel } = require('../models/product.model')
const { getProducts, getProductById } = require('../models/repo/product.repo')
const { createInventory } = require('../models/repo/inventory.repo')
const notiService = require('../services/notifi.service')

class ProductFactory{

    async createProduct({type, payload}){
        switch (type) {
            case 'clothing':
                return await new Clothing(payload).createProduct()
            case 'electronic':
                return await new Electronic(payload).createProduct()
            default:
                return {
                    code:401,
                    message:'Loại sản phẩm không hợp lệ!'
                }
        }
    }

    async findAllDarftsForShop({product_userId, page = 1}){
        try {
            const query = {product_userId, isDraft:true}
            const select = 'product_name product_thumb product_price _id'

            const products = await getProducts({query, select, page})
            return {
                code:201,
                metadata:products
            }
        } catch (error) {
            return error.message
        }
    }

    async findAllPublishedOfShop({product_userId, page = 1}){
        try {
            const query = {product_userId, isPublished:true}
            const select = 'product_name product_thumb product_price _id'

            const products = await getProducts({query, select, page})
            return {
                code:201,
                metadata:products
            }
        } catch (error) {
            return error.message
        }
    }

    async publishProductByShop({product_id, product_userId}){
        try {
            const foundProduct = await getProductById(product_id)
            if(!foundProduct) return {
                code:404,
                message:'Sản phẩm không tồn tại!'
            }

            if(foundProduct.product_userId !== product_userId){
                return {
                    code:401,
                    message:'Bạn không có quyền'
                }
            }

            const { modifiedCount } = await ProductModel.updateOne({_id:product_id, product_userId, isPublished:false}, {
                $set:{ isPublished:true, isDraft:false }
            }, {new:true})

            if(!modifiedCount) return {code:401, message:'Cập nhật không thành công'}
            
            if(modifiedCount) return {code:201, message:'Cập nhật sản phẩm thành công'}
            
        } catch (error) {
            return error.message
        }
    }

    async unPublishProductByShop({product_id, product_userId}){
        try {
            const foundProduct = await getProductById(product_id)
            if(!foundProduct) return {
                code:404,
                message:'Sản phẩm không tồn tại!'
            }

            if(foundProduct.product_userId !== product_userId){
                return {
                    code:401,
                    message:'Bạn không có quyền'
                }
            }

            const { modifiedCount } = await ProductModel.updateOne({_id:product_id, product_userId, isPublished:true}, {
                $set:{ isPublished:false, isDraft:true }
            }, {new:true})

            if(!modifiedCount) return {code:401, message:'Cập nhật không thành công'}
            
            if(modifiedCount) return {code:201, message:'Cập nhật sản phẩm thành công'}
            
        } catch (error) {
            return error.message
        }
    }

    async findOneDetailProduct({product_id}){
        try {
            const product = await ProductModel.findOne({
                _id:product_id,
                isPublished:true
            })
            if(!product) return {
                code:404,
                message:'Không tìm thấy sản phẩm'
            }

            return {code:201, metadata:product}
            
        } catch (error) {
            return error.message
        }
    }

    async findAllProducts({page = 1}){
        try {
            const query = {isPublished:true}
            const select = 'product_name product_thumb product_price _id'

            const products = await getProducts({query, select, page})
            return {
                code:201,
                metadata:products
            }
        } catch (error) {
            return error.message
        }
    }

    async searchProduct({page = 1, q}){
        try {
            const limit = 20
            let skip = (page - 1) * 20
            const regexSearch = new RegExp(q)
            const select = 'product_name product_thumb product_price _id'

            const products = await ProductModel.find({
                $text:{ $search: regexSearch},
                isPublished:true
            }, {score:{$meta: 'textScore'}})
            .populate('product_userId', 'username email avatar _id')
            .sort({createdAt:-1})
            .skip(skip)
            .limit(limit)
            .select(select)
            .lean()

            return {code:201, metadata: products}

        } catch (error) {
            return error.message
        }
    }

    async updateProductByShop({product_id, product_userId, body}){
        try {
            const foundProduct = await getProductById(product_id)
            if(!foundProduct) return {
                code:404,
                message:'Sản phẩm không tồn tại'
            }

            if(foundProduct.product_userId !== product_userId) return {
                code:401,
                message:'Bạn không đủ quyền'
            }

            const { modifiedCount } = await ProductModel.updateOne({_id:product_id, product_userId},{
                $set:body
            },{new:true})

            if(modifiedCount) return {code:201, message:'Cập nhật sản phẩm thành công'}
            if(!modifiedCount) return {code:401, message:'Cập nhật sản phẩm không thành công'}
        } catch (error) {
            return error.message
        }
    }

}

class Product{
    constructor({
        product_name, product_price, product_quantity, product_type, 
        product_thumb, product_description, product_attributes, product_userId
    }){
        this.product_name = product_name
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_attributes = product_attributes
        this.product_userId = product_userId
    }

    async createProduct(){
        const newProduct = await ProductModel.create(this)
        if(newProduct){
            await createInventory({
                productId:newProduct._id,
                userId:newProduct.product_userId,
                stock:newProduct.product_quantity
            })

            await notiService.createNotification({
                noti_type:'SHOP-001',
                noti_senderId:this.product_userId,
                noti_receivedId:1,
                noti_option:{
                    product_name:this.product_name,
                    shop_name:this.product_userId
                }
            })
        }

        return newProduct
    }
}

class Clothing extends Product{
    async createProduct(){
        const newProduct = await super.createProduct()
        if(!newProduct) return {
            code:401,
            message:'Tạo Product không thành công!'
        }

        const newClothing = await ClothingModel.create({
            _id:newProduct._id,
            product_userId:this.product_userId,
            ...this.product_attributes
        })
        if(!newClothing) return {
            code:401,
            message:'Tạo Clothing không thành công!'
        }

        return {code:201, metadata:newProduct}
    }
}

class Electronic extends Product{
    async createProduct(){
        const newProduct = await super.createProduct()
        if(!newProduct) return {
            code:401,
            message:'Tạo Product không thành công!'
        }

        const newElectronic = await ElectronicModel.create({
            _id:newProduct._id,
            product_userId:this.product_userId,
            ...this.product_attributes
        })
        if(!newElectronic) return {
            code:401,
            message:'Tạo Electronic không thành công!'
        }

        return {code:201, metadata:newProduct}
    }
}


module.exports = new ProductFactory
