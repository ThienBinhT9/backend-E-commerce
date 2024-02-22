const commentModel = require('../models/comment.model')
const { getProductById } = require('../models/repo/product.repo')

class CommentService{
        
    async createComment({comment_productId, comment_userId, comment_content, comment_parrentId = null}){
        try {
            const newComment = new commentModel({
                comment_productId,
                comment_userId,
                comment_content,
                comment_parrentId
            })

            let rightValue
            if(comment_parrentId){
                //reply comment
                const foundCommentParent = await commentModel.findById(comment_productId).lean()
                if(!foundCommentParent) return {code:404, message:'NotFound parrent comment'}

                rightValue = foundCommentParent.comment_right

                await commentModel.updateMany({
                    comment_productId,
                    comment_right:{$gte:rightValue}
                }, {
                    $inc:{ comment_right:2 }
                })

                await commentModel.updateMany({
                    comment_productId,
                    comment_left:{$gt:rightValue}
                }, {
                    $inc:{ comment_left:2 }
                })
            }else{ 
                const maxRightValue = await commentModel.findOne(
                    {comment_productId},
                    'comment_right',
                    {sort:{comment_right:-1}}
                ).lean()

                if(maxRightValue){
                    rightValue = maxRightValue.comment_right + 1
                }else{
                    rightValue = 1
                }
            }

            newComment.comment_left = rightValue
            newComment.comment_right = rightValue + 1

            await newComment.save()

            return {
                code:201,
                metadata:newComment
            }
        } catch (error) {
            return {
                code:500,
                message:error.message
            }
        }
    }

    async getComments({comment_productId, comment_parrentId = null, page = 1}){
        try {

            const query = {
                comment_productId,
                comment_parrentId,
                isDeleted:false
            }
            if(comment_parrentId){
                const parrentComment = await commentModel.findOne({comment_productId, isDeleted:false, comment_parrentId}).lean()
                if(!parrentComment) return {code:404, message:'NotFound parrent comment'}

                query.comment_left = {$gt: parrentComment.comment_left}
                query.comment_right = {$lt: parrentComment.comment_right}
            }

            let skip = (page - 1) * 20

            const comments = await commentModel.find(query)
            .populate('comment_userId', 'username avatar _id')
            .skip(skip)
            .limit(20)
            .sort({createdAt:-1})
            .lean()

            return {
                code:201,
                metadata:comments
            }
            
        } catch (error) {
            return {
                code:500,
                message:error.message
            }
        }
    }

    async deleteComment({comment_id, comment_productId, userId}){
        try {

            const product = await getProductById(comment_productId)
            if(!product) return {code:404, message:'NotFound product'}

            const comment = await commentModel.findOne({_id:comment_id, comment_productId, isDeleted:false}).lean()
            if(!comment) return {code:404, message:'NotFound comment'}

            if(userId === comment.comment_userId || userId === product.product_userId){
                const width = comment.comment_right - comment.comment_left + 1

                await commentModel.deleteMany({
                    comment_productId,
                    comment_left:{$gte:comment.comment_left},
                    comment_right:{$lte:comment.comment_right},
                })

                await commentModel.updateMany({
                    comment_productId,
                    comment_right:{$gt:comment.comment_right}
                },{
                    $inc:{
                        comment_right:-width
                    }
                })

                await commentModel.updateMany({
                    comment_productId,
                    comment_left:{$gt:comment.comment_right}
                },{
                    $inc:{
                        comment_left:-width
                    }
                })

                return {
                    code:200,
                    metadata:'Delete Successfully'
                }

                
            }else{
                return {code:401, message:'Bạn không có quyền!'}
            }


        } catch (error) {
            return {
                code:500,
                message:error.message
            }
        }
    }

}

module.exports = new CommentService
