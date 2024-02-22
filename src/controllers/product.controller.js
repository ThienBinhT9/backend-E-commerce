const ProductService = require('../services/product.service')

class ProductController{

    async createProduct(req, res) {
        try {
            const { product_type } = req.body
            const data = {
                ...req.body,
                product_userId:req.user_id
            }
            return await res.status(200).json(await ProductService.createProduct({type:product_type, payload:data}))
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    async findAllDarftsForShop(req, res) {
        try {
            const { page } = req.query
            return res.status(200).json(await ProductService.findAllDarftsForShop({product_userId:req.user_id, page}))
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    async findAllPublishedOfShop(req, res) {
        try {
            const { product_userId } = req.params
            const { page } = req.query
            return res.status(200).json(await ProductService.findAllPublishedOfShop({product_userId, page}))
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    async publishProductByShop(req, res) {
        try {
            const { product_id } = req.params
            return res.status(200).json(await ProductService.publishProductByShop({product_id, product_userId:req.user_id}))
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    async unPublishProductByShop(req, res) {
        try {
            const { product_id } = req.params
            return res.status(200).json(await ProductService.unPublishProductByShop({product_id, product_userId:req.user_id}))
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    async findAllProducts(req, res) {
        try {
            return res.status(200).json(await ProductService.findAllProducts())
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    async findOneDetailProduct(req, res) {
        try {
            const { product_id } = req.params
            return res.status(200).json(await ProductService.findOneDetailProduct({product_id}))
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    async updateProductByShop(req, res) {
        try {
            const {product_id} = req.params
            return res.status(200).json(await ProductService.updateProductByShop({product_id, product_userId:req.user_id, body:req.body}))
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    async searchProduct(req, res) {
        try {
            const {page, q} = req.query
            return res.status(200).json(await ProductService.searchProduct({q, page}))
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
}

module.exports = new ProductController
