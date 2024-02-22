const router = require('express').Router()
const AuthController = require('../controllers/auth.controller')
const { authorizedV2, authorized } = require('../middlewares')

router.post('/register', AuthController.register)

router.post('/login', AuthController.login)

router.post('/logout', authorized, AuthController.logout)

router.post('/refresh', authorizedV2, AuthController.handleRefreshTokens)

module.exports = router
