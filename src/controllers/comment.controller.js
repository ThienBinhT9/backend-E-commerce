const commentService = require('../services/comment.service')

class CommentController{
    async createComment(req, res) {
        try {
            const data = {
                ...req.body,
                comment_userId:req.user_id
            }
            return res.status(200).json(await commentService.createComment(data))
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    async getParrentComment(req, res){
        try {
            
            const {comment_productId, comment_parrentId} = req.params
            const {page} = req.query

            const data = {
                comment_parrentId,
                comment_productId,
                page
            }
            return res.status(200).json(await commentService.getComments(data))
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    async deleteComment(req, res) {
        try {
            const {comment_productId, comment_id} = req.params
            const data = {
                comment_productId,
                comment_id,
                userId:req.user_id
            }
            return res.status(200).json(await commentService.deleteComment(data))
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
}

module.exports = new CommentController
