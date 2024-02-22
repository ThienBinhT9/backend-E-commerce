const router = require('express').Router()
const commentController = require('../controllers/comment.controller')
const {authorized} = require('../middlewares')

router.post('/create', authorized, commentController.createComment)

router.get('/:comment_productId/:comment_parrentId', commentController.getParrentComment)

router.delete('/:comment_productId/:comment_id', authorized, commentController.deleteComment)


module.exports = router